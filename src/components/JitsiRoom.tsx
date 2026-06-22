import { JitsiMeeting } from "@jitsi/react-sdk";

// JaaS (Jitsi as a Service) public App ID — safe to ship in client code.
const JAAS_APP_ID = "vpaas-magic-cookie-8d126d2cd5be43a798a302358005d1b3";

interface Props {
  roomName: string;
  displayName: string;
  email?: string;
  onLeave: () => void;
}

const JitsiRoom = ({ roomName, displayName, email, onLeave }: Props) => {
  // JaaS requires rooms to be prefixed with the AppID
  const fullRoomName = `${JAAS_APP_ID}/${roomName}`;

  return (
    <div className="w-full h-[calc(100vh-4rem)]">
      <JitsiMeeting
        domain="8x8.vc"
        roomName={fullRoomName}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: true,
          enableEmailInStats: false,
          enableLobbyChat: false,
          enableInsecureRoomNameWarning: false,
          requireDisplayName: false,
          disableProfile: true,
          lobby: { enabled: false, autoKnock: false },
          securityUi: { hideLobbyButton: true, disableLobbyPassword: true },
          welcomePage: { disabled: true },
          hideConferenceSubject: true,
          hideConferenceTimer: false,
          disableDeepLinking: true,
          deeplinking: {
            disabled: true,
            hideLogo: true,
            desktop: { enabled: false },
            android: { enabled: false },
            ios: { enabled: false },
          },
          disableLocalVideoFlip: false,
          desktopSharingFrameRate: { min: 5, max: 30 },
          toolbarButtons: [
            "microphone", "camera", "desktop", "chat", "raisehand",
            "tileview", "fullscreen", "hangup", "settings", "participants-pane",
          ],
        }}
        interfaceConfigOverwrite={{
          MOBILE_APP_PROMO: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
          JITSI_WATERMARK_LINK: "",
          DEFAULT_LOGO_URL: "",
          DEFAULT_WELCOME_PAGE_LOGO_URL: "",
          HIDE_DEEP_LINKING_LOGO: true,
        }}
        userInfo={{
          displayName,
          email: email || "",
        }}
        onReadyToClose={onLeave}
        getIFrameRef={(iframe) => {
          iframe.style.height = "100%";
          iframe.style.width = "100%";
          iframe.style.border = "0";
        }}
      />
    </div>
  );
};

export default JitsiRoom;
