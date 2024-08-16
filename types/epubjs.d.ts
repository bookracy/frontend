/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "epubjs" {
  type Book = {
    renderTo: (element: HTMLElement, options: any) => Rendition;
    ready: Promise<void>;
    destroy: () => void;
    // Additional properties that might be needed from the Book instance
    settings: any;
    opening: any;
    opened: any;
    spine: any;
    resources: any;
    navigation: any;
    locations: any;
    coverUrl: () => Promise<string>;
    // more properties from the Book class can be added as needed
  };

  type Rendition = {
    themes: {
      default: (styles: any) => void;
    };
    display: (target?: string) => void;
    destroy: () => void;
    // other properties and methods of Rendition
  };

  const EPUBJS: (url: string) => Book;
  export default EPUBJS;
}