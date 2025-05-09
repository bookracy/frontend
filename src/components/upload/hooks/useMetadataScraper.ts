import { ExtendedBookItem } from "./useAutofill";
import { useMutation } from "@tanstack/react-query";

// Extended type for local use to include publication_year
interface EnhancedBookItem extends ExtendedBookItem {
  publication_year?: number;
}

// Scrape metadata from the book filename with more advanced pattern matching
export function scrapeMetadataFromFilename(filename: string): Partial<EnhancedBookItem> {
  // Remove file extension if present
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
  
  // Pattern 1: "Author - Title (Year)" or "Title - Author (Year)"
  const dashPattern = /^(.+?)\s*-\s*(.+?)(?:\s*\((\d{4})(?:,\s*([^)]+))?\))?$/;
  
  // Pattern 2: "Title_Book_Number_Series_Author_Name" format
  const underscorePattern = /^(.+?)(?:_Book_(\d+))?(?:_A_.+?)?_([A-Z][a-z]+(?:_[A-Z][a-z]+)+)$/;
  
  // Pattern 3: Just title with possible book number/volume indication
  const simplePattern = /^(.+?)(?:\s+(?:Book|Volume|Vol\.?)\s*(\d+))?$/i;

  const result: Partial<EnhancedBookItem> = {};
  
  // Try Pattern 1
  const dashMatch = nameWithoutExtension.match(dashPattern);
  if (dashMatch) {
    // Determine which part is the author and which is the title
    // If first part contains words with all capitals, it's likely the author
    const isFirstPartAuthor = /[A-Z][a-z]+\s+[A-Z][a-z]+/.test(dashMatch[1]);
    
    if (isFirstPartAuthor) {
      result.author = dashMatch[1].trim();
      result.title = dashMatch[2].trim();
    } else {
      result.title = dashMatch[1].trim();
      result.author = dashMatch[2].trim();
    }
    
    if (dashMatch[3]) {
      result.publication_year = parseInt(dashMatch[3]);
    }
    
    return result;
  }
  
  // Try Pattern 2
  const underscoreMatch = nameWithoutExtension.match(underscorePattern);
  if (underscoreMatch) {
    result.title = underscoreMatch[1].replace(/_/g, ' ').trim();
    
    if (underscoreMatch[2]) {
      result.title += ` (Book ${underscoreMatch[2]})`;
    }
    
    // Convert author from underscore format to spaces
    if (underscoreMatch[3]) {
      result.author = underscoreMatch[3].replace(/_/g, ' ').trim();
    }
    
    return result;
  }
  
  // Try Pattern 3
  const simpleMatch = nameWithoutExtension.match(simplePattern);
  if (simpleMatch) {
    result.title = simpleMatch[1].replace(/_/g, ' ').trim();
    return result;
  }
  
  // If all patterns fail, just use the filename as title
  result.title = nameWithoutExtension.replace(/_/g, ' ').trim();
  return result;
}

// Advanced pattern matching for specific formats
export function refineMetadata(filename: string, initialMetadata: Partial<EnhancedBookItem>): Partial<EnhancedBookItem> {
  const metadata = { ...initialMetadata };
  
  // Handle formats like "Mark_of_the_Fool_Book_1_A_Progression_Fantasy_Epic_J_M_Clarke"
  if (filename.includes('_')) {
    // Look for author patterns (First_Middle_Last) at the end
    const authorPattern = /([A-Z][a-z]*_[A-Z][a-z]*(?:_[A-Z][a-z]*)*)$/;
    const authorMatch = filename.match(authorPattern);
    
    if (authorMatch) {
      metadata.author = authorMatch[1].replace(/_/g, ' ');
      
      // Remove author from title if it was incorrectly included
      if (metadata.title && metadata.title.endsWith(metadata.author)) {
        metadata.title = metadata.title.substring(0, metadata.title.length - metadata.author.length).trim();
      }
    }
    
    // Look for "Book X" pattern
    const bookNumberPattern = /_Book_(\d+)_/;
    const bookMatch = filename.match(bookNumberPattern);
    
    if (bookMatch && metadata.title) {
      if (!metadata.title.includes(`Book ${bookMatch[1]}`)) {
        metadata.title += ` (Book ${bookMatch[1]})`;
      }
    }
  }
  
  return metadata;
}

interface ScraperParams {
  filename: string;
  index: number;
}

interface ScraperResult {
  data: Partial<EnhancedBookItem>;
  index: number;
}

export const useMetadataScraper = (onSuccess: (data: Partial<EnhancedBookItem>) => void) => {
  return useMutation({
    mutationFn: async (params: ScraperParams) => {
      // Extract basic metadata
      const basicMetadata = scrapeMetadataFromFilename(params.filename);
      
      // Apply refinements for special cases
      const enhancedMetadata = refineMetadata(params.filename, basicMetadata);
      
      return { 
        data: enhancedMetadata, 
        index: params.index 
      };
    },
    onSuccess: (result: ScraperResult) => {
      if (result.data) {
        onSuccess(result.data);
      }
    },
  });
}; 