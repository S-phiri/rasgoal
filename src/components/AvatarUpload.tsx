import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

interface AvatarUploadProps {
  avatarUrl: string | null;
  onUpload: (file: File) => Promise<string | null>;
  size?: "sm" | "lg";
}

const AvatarUpload = ({ avatarUrl, onUpload, size = "sm" }: AvatarUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Compress to ~200KB max, 512px max dimension (avatars don't need more)
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 512,
        useWebWorker: true,
        fileType: "image/jpeg",
      });
      await onUpload(compressed as File);
      toast.success("Profile photo updated!");
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      toast.error(err?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const sizeClasses = size === "lg" ? "w-20 h-20" : "w-10 h-10";
  const iconSize = size === "lg" ? "w-5 h-5" : "w-3 h-3";

  return (
    <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
      <Avatar className={`${sizeClasses} border-2 border-border`}>
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="Profile" /> : null}
        <AvatarFallback className="bg-primary/10">
          <User className={iconSize + " text-primary"} />
        </AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
        {uploading ? (
          <Loader2 className={`${iconSize} text-background animate-spin opacity-100`} />
        ) : (
          <Camera className={`${iconSize} text-background opacity-0 group-hover:opacity-100 transition-opacity`} />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default AvatarUpload;
