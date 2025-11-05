declare module 'clsx' {
  export type ClassValue = string | number | boolean | undefined | null | ClassValue[];
  function clsx(...inputs: ClassValue[]): string;
  export default clsx;
}
