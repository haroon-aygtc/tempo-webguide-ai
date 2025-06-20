import React from "react";
import SettingSection from "../SettingSection";
import SettingField from "../SettingField";

interface AppearanceSettingsProps {
  settings: {
    theme: string;
    primaryColor: string;
    position: string;
    size: string;
    borderRadius: number;
    showAvatar: boolean;
    avatarStyle: string;
    animationSpeed: string;
    transparency: number;
  };
  onChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

const AppearanceSettings = ({
  settings,
  onChange,
  errors = {},
}: AppearanceSettingsProps) => {
  return (
    <div className="space-y-6">
      <SettingSection
        title="Theme & Colors"
        description="Customize the visual appearance of your assistant"
        helpText="These settings control the overall look and feel of the assistant interface."
      >
        <SettingField
          type="radio"
          label="Theme"
          description="Choose the color scheme for the assistant"
          value={settings.theme}
          onChange={(value) => onChange("theme", value)}
          options={[
            {
              value: "light",
              label: "Light Theme",
              description: "Clean, bright appearance",
            },
            {
              value: "dark",
              label: "Dark Theme",
              description: "Modern, easy on the eyes",
            },
            {
              value: "auto",
              label: "Auto (System)",
              description: "Matches user's system preference",
            },
          ]}
          helpText="The theme affects all visual elements of the assistant interface."
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Color</label>
          <p className="text-xs text-muted-foreground">
            Main accent color for buttons and highlights
          </p>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => onChange("primaryColor", e.target.value)}
              className="w-12 h-10 rounded-md border border-input cursor-pointer"
            />
            <div className="flex-1">
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => onChange("primaryColor", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-md"
                placeholder="#3b82f6"
              />
            </div>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Layout & Positioning"
        description="Control where and how the assistant appears"
        helpText="These settings determine the physical placement and size of the assistant interface."
      >
        <SettingField
          type="radio"
          label="Position"
          description="Where the assistant appears on the page"
          value={settings.position}
          onChange={(value) => onChange("position", value)}
          options={[
            {
              value: "bottom-right",
              label: "Bottom Right",
              description: "Traditional chat position (recommended)",
            },
            {
              value: "bottom-left",
              label: "Bottom Left",
              description: "Alternative corner position",
            },
            {
              value: "top-right",
              label: "Top Right",
              description: "Header area position",
            },
            {
              value: "floating",
              label: "Floating",
              description: "Draggable, user-controlled position",
            },
          ]}
          helpText="Choose a position that doesn't interfere with your website's main content."
        />

        <SettingField
          type="radio"
          label="Size"
          description="Overall size of the assistant interface"
          value={settings.size}
          onChange={(value) => onChange("size", value)}
          options={[
            {
              value: "compact",
              label: "Compact",
              description: "Minimal space usage",
            },
            {
              value: "medium",
              label: "Medium",
              description: "Balanced size (recommended)",
            },
            {
              value: "large",
              label: "Large",
              description: "Maximum visibility and usability",
            },
          ]}
          helpText="Larger sizes are more prominent but take up more screen space."
        />

        <SettingField
          type="slider"
          label="Border Radius"
          description="Roundness of interface corners"
          value={settings.borderRadius}
          onChange={(value) => onChange("borderRadius", value)}
          min={0}
          max={20}
          step={1}
          unit="px"
          helpText="Higher values create more rounded, modern-looking interfaces."
        />
      </SettingSection>

      <SettingSection
        title="Avatar & Branding"
        description="Customize the assistant's visual identity"
        helpText="These settings control how the assistant represents itself visually."
      >
        <SettingField
          type="toggle"
          label="Show Avatar"
          description="Display an avatar image for the assistant"
          value={settings.showAvatar}
          onChange={(value) => onChange("showAvatar", value)}
          helpText="Avatars help humanize the assistant and make interactions feel more personal."
        />

        <SettingField
          type="select"
          label="Avatar Style"
          description="Choose the type of avatar to display"
          value={settings.avatarStyle}
          onChange={(value) => onChange("avatarStyle", value)}
          disabled={!settings.showAvatar}
          options={[
            {
              value: "robot",
              label: "Robot",
              description: "Friendly robot character",
            },
            {
              value: "abstract",
              label: "Abstract",
              description: "Geometric shapes and patterns",
            },
            {
              value: "initials",
              label: "Initials",
              description: "Text-based avatar with initials",
            },
            {
              value: "custom",
              label: "Custom Image",
              description: "Upload your own avatar image",
            },
          ]}
          helpText="Choose a style that matches your brand and user expectations."
        />
      </SettingSection>

      <SettingSection
        title="Animation & Effects"
        description="Control visual animations and transitions"
        helpText="These settings affect how the assistant moves and transitions between states."
      >
        <SettingField
          type="radio"
          label="Animation Speed"
          description="Speed of interface animations and transitions"
          value={settings.animationSpeed}
          onChange={(value) => onChange("animationSpeed", value)}
          options={[
            {
              value: "none",
              label: "No Animations",
              description: "Instant transitions, better performance",
            },
            {
              value: "slow",
              label: "Slow",
              description: "Gentle, relaxed animations",
            },
            {
              value: "normal",
              label: "Normal",
              description: "Balanced speed (recommended)",
            },
            {
              value: "fast",
              label: "Fast",
              description: "Quick, snappy animations",
            },
          ]}
          helpText="Slower animations feel more polished but may seem sluggish to some users."
        />

        <SettingField
          type="slider"
          label="Background Transparency"
          description="Opacity of the assistant background"
          value={settings.transparency}
          onChange={(value) => onChange("transparency", value)}
          min={0}
          max={100}
          step={5}
          unit="%"
          helpText="Higher transparency allows more of the underlying page to show through."
        />
      </SettingSection>
    </div>
  );
};

export default AppearanceSettings;
