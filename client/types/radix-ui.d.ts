declare module '@radix-ui/react-slot' {
  import * as React from 'react';
  export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  export const Slot: React.ForwardRefExoticComponent<SlotProps & React.RefAttributes<HTMLElement>>;
}

declare module '@radix-ui/react-avatar' {
  import * as React from 'react';
  export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}
  export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}
  export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

  export const Root: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>>;
  export const Image: React.ForwardRefExoticComponent<AvatarImageProps & React.RefAttributes<HTMLImageElement>>;
  export const Fallback: React.ForwardRefExoticComponent<AvatarFallbackProps & React.RefAttributes<HTMLDivElement>>;
}

declare module '@radix-ui/react-alert-dialog' {
  import * as React from 'react';

  export interface AlertDialogProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }

  export interface AlertDialogTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
  }
  export interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}
  export interface AlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
  export interface AlertDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
  export interface AlertDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
  export interface AlertDialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
  export interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
  export interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

  export const Root: React.ComponentType<AlertDialogProps>;
  export const Trigger: React.ForwardRefExoticComponent<AlertDialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
  export const Portal: React.ComponentType<{ children?: React.ReactNode }>;
  export const Overlay: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
  export const Content: React.ForwardRefExoticComponent<AlertDialogContentProps & React.RefAttributes<HTMLDivElement>>;
  export const Header: React.ComponentType<AlertDialogHeaderProps>;
  export const Footer: React.ComponentType<AlertDialogFooterProps>;
  export const Title: React.ForwardRefExoticComponent<AlertDialogTitleProps & React.RefAttributes<HTMLHeadingElement>>;
  export const Description: React.ForwardRefExoticComponent<AlertDialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
  export const Action: React.ForwardRefExoticComponent<AlertDialogActionProps & React.RefAttributes<HTMLButtonElement>>;
  export const Cancel: React.ForwardRefExoticComponent<AlertDialogCancelProps & React.RefAttributes<HTMLButtonElement>>;
}

declare module '@radix-ui/react-separator' {
  import * as React from 'react';
  export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  }
  export const Root: React.ForwardRefExoticComponent<SeparatorProps & React.RefAttributes<HTMLDivElement>>;
}
