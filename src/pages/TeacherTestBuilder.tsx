import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomTests, CustomTestQuestion } from "@/hooks/useCustomTests";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Plus, Trash2, Save, Image as ImageIcon, GripVertical, Upload } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface QuestionDraft {
  id?: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  image_url: string | null;
  display_order: number;
}

const TeacherTestBuilder = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getQuestions, saveQuestion, deleteQuestion, updateTest, createTest } = useCustomTests();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [currentTestId, setCurrentTestId] = useState(testId || "");
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (testId) {
      loadTest();
    }
  }, [testId]);

  const loadTest = async () => {
    if (!testId) return;
    const { data: test } = await supabase.from("custom_tests").select("*").eq("id", testId).single();
    if (test) {
      setTitle(test.title);
      setDescription(test.description || "");
      setSubject(test.subject || "");
    }
    const qs = await getQuestions(testId);
    setQuestions(qs.map((q) => ({
      id: q.id,
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      image_url: q.image_url,
      display_order: q.display_order,
    })));
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question_text: "", options: ["", "", "", ""], correct_answer: 0, image_url: null, display_order: prev.length },
    ]);
  };

  const updateQuestionField = (idx: number, field: keyof QuestionDraft, value: any) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)));
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.map((o, j) => (j === oIdx ? value : o)) } : q
      )
    );
  };

  const removeQuestion = async (idx: number) => {
    const q = questions[idx];
    if (q.id) {
      await deleteQuestion(q.id);
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleImageUpload = async (idx: number, file: File) => {
    if (!user) return;
    setUploadingIdx(idx);
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("test-images").upload(path, file);
    if (error) {
      toast.error("Image upload failed");
      setUploadingIdx(null);
      return;
    }
    const { data: urlData } = supabase.storage.from("test-images").getPublicUrl(path);
    updateQuestionField(idx, "image_url", urlData.publicUrl);
    setUploadingIdx(null);
  };

  const handleImportExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws);

        if (rows.length === 0) {
          toast.error("No questions found in the file");
          return;
        }

        const letterToIndex: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 };
        const imported: QuestionDraft[] = rows.map((row, i) => {
          const options: string[] = [];
          ["A", "B", "C", "D", "E", "F"].forEach((letter) => {
            const val = row[`Option ${letter}`];
            if (val && String(val).trim()) options.push(String(val).trim());
          });

          const correctRaw = String(row["Correct Answer"] || "A").trim().toUpperCase();
          const correctAnswer = letterToIndex[correctRaw] ?? 0;

          return {
            question_text: String(row["Question"] || "").trim(),
            options: options.length > 0 ? options : ["", "", "", ""],
            correct_answer: correctAnswer,
            image_url: null,
            display_order: questions.length + i,
          };
        }).filter((q) => q.question_text);

        if (imported.length === 0) {
          toast.error("No valid questions found. Ensure the file has a 'Question' column.");
          return;
        }

        setQuestions((prev) => [...prev, ...imported]);

        if (!subject && rows[0]["Subject"]) {
          setSubject(String(rows[0]["Subject"]).trim());
        }

        toast.success(`Imported ${imported.length} questions from Excel`);
      } catch (err) {
        toast.error("Failed to parse Excel file");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a test title");
      return;
    }
    const validQs = questions.filter((q) => q.question_text.trim() && q.options.some((o) => o.trim()));
    if (validQs.length === 0) {
      toast.error("Add at least one question");
      return;
    }

    setSaving(true);
    try {
      let tId = currentTestId;
      if (!tId) {
        const test = await createTest(title, description, subject);
        if (!test) throw new Error("Failed to create test");
        tId = test.id;
        setCurrentTestId(tId);
      } else {
        await updateTest(tId, { title, description, subject });
      }

      for (let i = 0; i < validQs.length; i++) {
        await saveQuestion({
          ...(validQs[i].id ? { id: validQs[i].id } : {}),
          test_id: tId,
          question_text: validQs[i].question_text,
          options: validQs[i].options.filter((o) => o.trim()),
          correct_answer: validQs[i].correct_answer,
          image_url: validQs[i].image_url,
          display_order: i,
        });
      }

      toast.success("Test saved!");
      navigate("/teacher/tests");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
    setSaving(false);
  };

  // Allow paste/copy/cut inside this builder (overrides global block in index.html)
  const allowClipboard = (e: React.ClipboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="min-h-screen bg-background"
      onPaste={allowClipboard}
      onCopy={allowClipboard}
      onCut={allowClipboard}
    >
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/teacher/tests")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold font-display text-foreground">
            {testId ? "Edit Test" : "Create New Test"}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Test info */}
        <Card className="p-6 space-y-4">
          <div>
            <Label>Test Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mathematics Mid-Term Test" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the test..." />
          </div>
          <div>
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" />
          </div>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-display font-bold text-foreground">Questions ({questions.length})</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => importInputRef.current?.click()}>
                <Upload className="w-4 h-4" /> Import Excel
              </Button>
              <input
                ref={importInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportExcel(file);
                  e.target.value = "";
                }}
              />
              <Button onClick={addQuestion} size="sm" className="gap-1">
                <Plus className="w-4 h-4" /> Add Question
              </Button>
            </div>
          </div>

          {questions.map((q, idx) => (
            <Card key={idx} className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-bold text-muted-foreground">Q{idx + 1}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeQuestion(idx)} className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label>Question Text *</Label>
                <Textarea
                  value={q.question_text}
                  onChange={(e) => updateQuestionField(idx, "question_text", e.target.value)}
                  placeholder="Enter your question..."
                />
              </div>

              {/* Image upload */}
              <div>
                <Label>Image (optional)</Label>
                <div className="flex items-center gap-3 mt-1">
                  {q.image_url ? (
                    <div className="relative">
                      <img src={q.image_url} alt="Question" className="w-32 h-24 object-cover rounded border" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 w-6 h-6"
                        onClick={() => updateQuestionField(idx, "image_url", null)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-dashed rounded-lg text-sm text-muted-foreground hover:border-primary transition-colors">
                      <ImageIcon className="w-4 h-4" />
                      {uploadingIdx === idx ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(idx, file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Answer Options — click the radio button to mark the correct answer</Label>
                <RadioGroup
                  value={String(q.correct_answer)}
                  onValueChange={(val) => updateQuestionField(idx, "correct_answer", parseInt(val))}
                >
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-colors cursor-pointer ${
                        q.correct_answer === oIdx
                          ? "border-green-500 bg-green-500/10"
                          : "border-transparent hover:border-muted"
                      }`}
                      onClick={() => updateQuestionField(idx, "correct_answer", oIdx)}
                    >
                      <RadioGroupItem value={String(oIdx)} id={`q${idx}-o${oIdx}`} className="shrink-0" />
                      <label htmlFor={`q${idx}-o${oIdx}`} className="text-xs font-bold text-muted-foreground w-6">
                        {String.fromCharCode(65 + oIdx)}.
                      </label>
                      <Input
                        value={opt}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateOption(idx, oIdx, e.target.value);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                        className="flex-1"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {q.correct_answer === oIdx && (
                        <span className="text-xs font-semibold text-green-600 whitespace-nowrap">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </RadioGroup>
                {q.options.length < 6 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuestionField(idx, "options", [...q.options, ""])}
                    className="text-xs"
                  >
                    + Add option
                  </Button>
                )}
              </div>
            </Card>
          ))}

          {questions.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-3">No questions yet. Start building your test!</p>
              <Button onClick={addQuestion} className="gap-1">
                <Plus className="w-4 h-4" /> Add First Question
              </Button>
            </Card>
          )}
        </div>

        {/* Save */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" onClick={() => navigate("/teacher/tests")}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-1">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Test"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherTestBuilder;
