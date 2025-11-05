declare module 'class-variance-authority' {
  type VariantProps<T extends (...args: any) => any> = Omit<Parameters<T>[0], 'class' | 'className'>;

  interface ConfigVariants {
    [key: string]: Record<string, any>;
  }

  interface Config {
    base?: string;
    variants?: ConfigVariants;
    compoundVariants?: Array<Record<string, any>>;
    defaultVariants?: Record<string, any>;
  }

  function cva(base?: string, config?: Config): (...args: any[]) => string;

  export { cva, type VariantProps };
}
