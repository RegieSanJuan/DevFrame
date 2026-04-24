export const clerkAuthAppearance = {
  variables: {
    colorPrimary: "#c9a96e",
    colorBackground: "#121212",
    colorInputBackground: "#0f0f0f",
    colorInputText: "#f5f5f5",
    colorText: "#f5f5f5",
    colorTextSecondary: "#a1a1aa",
    colorNeutral: "#27272a",
    colorDanger: "#f87171",
    borderRadius: "1rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "border border-zinc-800 bg-zinc-950 shadow-sm",
    headerTitle: "text-white",
    headerSubtitle: "text-zinc-400",
    socialButtonsBlockButton:
      "border border-zinc-700 bg-zinc-950 text-white hover:bg-zinc-900",
    socialButtonsBlockButtonText: "text-white",
    dividerLine: "bg-zinc-800",
    dividerText: "text-zinc-500",
    formFieldLabel: "text-white",
    formFieldInput:
      "border border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500",
    formButtonPrimary: "bg-accent text-background hover:bg-accent-strong",
    footerActionText: "text-zinc-400",
    footerActionLink: "text-white underline-offset-4 hover:underline",
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-zinc-300",
    formResendCodeLink: "text-white",
    otpCodeFieldInput: "border border-zinc-700 bg-zinc-950 text-white",
    alertText: "text-white",
    alertClerkError: "border border-red-900 bg-red-950 text-red-200",
    alertClerkWarning: "border border-amber-900 bg-amber-950 text-amber-200",
  },
} as const;

export const clerkUserProfileAppearance = {
  variables: {
    colorPrimary: "#c9a96e",
    colorBackground: "#111111",
    colorInputBackground: "#171717",
    colorInputText: "#f5f5f5",
    colorText: "#f5f5f5",
    colorTextSecondary: "#a1a1aa",
    colorNeutral: "#27272a",
    colorDanger: "#f87171",
    borderRadius: "1rem",
  },
  elements: {
    modalBackdrop: "bg-black/70 backdrop-blur-sm",
    modalContent: "border border-zinc-800 bg-zinc-950 text-white shadow-2xl",
    card: "border border-zinc-800 bg-zinc-950 text-white shadow-xl",
    navbar: "border-r border-zinc-800 bg-zinc-950",
    navbarButton:
      "text-zinc-300 hover:bg-zinc-900 hover:text-white data-[active=true]:bg-zinc-900 data-[active=true]:text-white",
    navbarButtonIcon: "text-zinc-400",
    pageScrollBox: "bg-zinc-950",
    page: "bg-zinc-950 text-white",
    headerTitle: "text-white",
    headerSubtitle: "text-zinc-400",
    profileSectionTitleText: "text-white",
    profileSectionPrimaryButton: "bg-accent text-background hover:bg-accent-strong",
    formFieldLabel: "text-white",
    formFieldInput:
      "border border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500",
    formButtonPrimary: "bg-accent text-background hover:bg-accent-strong",
    formButtonReset: "text-zinc-300 hover:bg-zinc-900 hover:text-white",
    accordionTriggerButton: "text-white hover:bg-zinc-900",
    accordionContent: "bg-zinc-950 text-zinc-300",
    badge: "border border-zinc-700 bg-zinc-900 text-zinc-200",
    footer: "border-t border-zinc-800 bg-zinc-950",
    footerActionText: "text-zinc-400",
    footerActionLink: "text-white underline-offset-4 hover:underline",
    alertText: "text-white",
    alertClerkError: "border border-red-900 bg-red-950 text-red-200",
    alertClerkWarning: "border border-amber-900 bg-amber-950 text-amber-200",
  },
} as const;

export const clerkUserButtonAppearance = {
  variables: {
    colorPrimary: "#c9a96e",
    colorBackground: "#111111",
    colorText: "#f5f5f5",
    colorTextSecondary: "#a1a1aa",
    colorNeutral: "#27272a",
    colorDanger: "#f87171",
    borderRadius: "0.75rem",
  },
  elements: {
    userButtonTrigger:
      "!rounded-md !border !border-zinc-700 !bg-zinc-950 !px-3 !py-2 !text-sm !font-semibold !text-white !shadow-none transition-colors hover:!border-zinc-500 hover:!bg-zinc-900 focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 data-[state=open]:!border-zinc-500 data-[state=open]:!bg-zinc-900",
    userButtonBox: "!flex-row-reverse !gap-2",
    userButtonOuterIdentifier: "!text-sm !font-semibold !text-white",
    avatarBox: "!size-7",
    userButtonPopoverCard:
      "!border !border-zinc-800 !bg-zinc-950 !text-white !shadow-2xl",
    userButtonPopoverMain: "!bg-zinc-950 !text-white",
    userButtonPopoverFooter:
      "!border-t !border-zinc-800 !bg-zinc-950 !text-zinc-300",
    userPreviewMainIdentifier: "!text-white",
    userPreviewSecondaryIdentifier: "!text-zinc-400",
    userButtonPopoverActionButton:
      "!text-zinc-200 hover:!bg-zinc-900 hover:!text-white",
    userButtonPopoverActionButtonText: "!text-zinc-200",
    userButtonPopoverActionButtonIcon: "!text-zinc-400",
  },
} as const;
