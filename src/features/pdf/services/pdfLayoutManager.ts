import type { jsPDF } from 'jspdf';

export interface PageDimensions {
  width: number;
  height: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface Position {
  x: number;
  y: number;
}

export interface TextOptions {
  fontSize?: number;
  fontStyle?: 'normal' | 'bold' | 'italic';
  color?: string;
  align?: 'left' | 'center' | 'right';
  maxWidth?: number;
  lineHeight?: number;
}

export interface ElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Advanced PDF Layout Manager
 * Handles positioning, spacing, and layout calculations for PDF generation
 */
export class PdfLayoutManager {
  private doc: jsPDF;
  private dimensions: PageDimensions;
  private currentPosition: Position;
  private pageCount: number = 1;

  // Layout constants
  private readonly DEFAULT_FONT_SIZE = 12;
  private readonly DEFAULT_LINE_HEIGHT = 1.4;
  private readonly SECTION_SPACING = 20;
  private readonly PARAGRAPH_SPACING = 12;

  constructor(doc: jsPDF, dimensions: PageDimensions) {
    this.doc = doc;
    this.dimensions = dimensions;
    this.currentPosition = {
      x: dimensions.margins.left,
      y: dimensions.margins.top
    };
  }

  /**
   * Get current cursor position
   */
  getCurrentPosition(): Position {
    return { ...this.currentPosition };
  }

  /**
   * Set current cursor position
   */
  setPosition(x: number, y: number): void {
    this.currentPosition.x = x;
    this.currentPosition.y = y;
  }

  /**
   * Move cursor to next line
   */
  moveToNextLine(lineHeight?: number): void {
    const height = lineHeight || (this.DEFAULT_FONT_SIZE * this.DEFAULT_LINE_HEIGHT);
    this.currentPosition.y += height;
    this.currentPosition.x = this.dimensions.margins.left;
    
    // Check if we need a new page
    if (this.currentPosition.y > this.getMaxContentHeight()) {
      this.addNewPage();
    }
  }

  /**
   * Add vertical spacing
   */
  addVerticalSpace(space: number): void {
    this.currentPosition.y += space;
    
    if (this.currentPosition.y > this.getMaxContentHeight()) {
      this.addNewPage();
    }
  }

  /**
   * Add a new page and reset position
   */
  addNewPage(): void {
    this.doc.addPage();
    this.pageCount++;
    this.currentPosition = {
      x: this.dimensions.margins.left,
      y: this.dimensions.margins.top
    };
  }

  /**
   * Calculate available content width
   */
  getContentWidth(): number {
    return this.dimensions.width - this.dimensions.margins.left - this.dimensions.margins.right;
  }

  /**
   * Calculate available content height
   */
  getContentHeight(): number {
    return this.dimensions.height - this.dimensions.margins.top - this.dimensions.margins.bottom;
  }

  /**
   * Get maximum Y position for content
   */
  private getMaxContentHeight(): number {
    return this.dimensions.height - this.dimensions.margins.bottom;
  }

  /**
   * Calculate text dimensions
   */
  calculateTextDimensions(text: string, options: TextOptions = {}): { width: number; height: number } {
    const fontSize = options.fontSize || this.DEFAULT_FONT_SIZE;
    const lineHeight = options.lineHeight || this.DEFAULT_LINE_HEIGHT;
    
    // Set font for accurate measurements
    this.doc.setFontSize(fontSize);
    if (options.fontStyle) {
      this.doc.setFont('helvetica', options.fontStyle);
    }
    
    const maxWidth = options.maxWidth || this.getContentWidth();
    const lines = this.doc.splitTextToSize(text, maxWidth);
    
    return {
      width: Math.min(this.doc.getTextWidth(text), maxWidth),
      height: lines.length * fontSize * lineHeight
    };
  }

  /**
   * Add text with automatic positioning and wrapping
   */
  addText(text: string, options: TextOptions = {}): ElementBounds {
    const fontSize = options.fontSize || this.DEFAULT_FONT_SIZE;
    const lineHeight = options.lineHeight || this.DEFAULT_LINE_HEIGHT;
    const maxWidth = options.maxWidth || this.getContentWidth();
    
    // Apply text options
    this.doc.setFontSize(fontSize);
    if (options.fontStyle) {
      this.doc.setFont('helvetica', options.fontStyle);
    }
    if (options.color) {
      this.doc.setTextColor(options.color);
    }
    
    // Split text to fit width
    const lines = this.doc.splitTextToSize(text, maxWidth);
    const totalHeight = lines.length * fontSize * lineHeight;
    
    // Check if text fits on current page
    if (this.currentPosition.y + totalHeight > this.getMaxContentHeight()) {
      this.addNewPage();
    }
    
    const startPosition = { ...this.currentPosition };
    
    // Calculate x position based on alignment
    let x = this.currentPosition.x;
    if (options.align === 'center') {
      x = this.dimensions.margins.left + (this.getContentWidth() / 2);
    } else if (options.align === 'right') {
      x = this.dimensions.width - this.dimensions.margins.right;
    }
    
    // Add text
    this.doc.text(lines, x, this.currentPosition.y, { 
      align: options.align || 'left' 
    });
    
    // Update position
    this.currentPosition.y += totalHeight;
    
    return {
      x: startPosition.x,
      y: startPosition.y,
      width: maxWidth,
      height: totalHeight
    };
  }

  /**
   * Add a heading with consistent styling
   */
  addHeading(text: string, level: 1 | 2 | 3 = 1): ElementBounds {
    const headingSizes = { 1: 18, 2: 16, 3: 14 };
    const headingSpacing = { 1: this.SECTION_SPACING, 2: 16, 3: 12 };
    
    // Add spacing before heading (except at top of page)
    if (this.currentPosition.y > this.dimensions.margins.top) {
      this.addVerticalSpace(headingSpacing[level]);
    }
    
    const bounds = this.addText(text, {
      fontSize: headingSizes[level],
      fontStyle: 'bold',
      color: '#2D3748'
    });
    
    // Add spacing after heading
    this.addVerticalSpace(this.PARAGRAPH_SPACING);
    
    return bounds;
  }

  /**
   * Add a paragraph with consistent spacing
   */
  addParagraph(text: string, options: TextOptions = {}): ElementBounds {
    const bounds = this.addText(text, {
      fontSize: this.DEFAULT_FONT_SIZE,
      lineHeight: this.DEFAULT_LINE_HEIGHT,
      ...options
    });
    
    this.addVerticalSpace(this.PARAGRAPH_SPACING);
    
    return bounds;
  }

  /**
   * Draw a horizontal line
   */
  addHorizontalLine(width?: number, color: string = '#E2E8F0'): void {
    const lineWidth = width || this.getContentWidth();
    
    this.doc.setDrawColor(color);
    this.doc.setLineWidth(0.5);
    this.doc.line(
      this.currentPosition.x,
      this.currentPosition.y,
      this.currentPosition.x + lineWidth,
      this.currentPosition.y
    );
    
    this.addVerticalSpace(this.PARAGRAPH_SPACING);
  }

  /**
   * Add an image with automatic positioning
   */
  addImage(imgData: string, width: number, height: number, options: { align?: 'left' | 'center' | 'right' } = {}): ElementBounds {
    // Check if image fits on current page
    if (this.currentPosition.y + height > this.getMaxContentHeight()) {
      this.addNewPage();
    }
    
    let x = this.currentPosition.x;
    if (options.align === 'center') {
      x = this.dimensions.margins.left + (this.getContentWidth() - width) / 2;
    } else if (options.align === 'right') {
      x = this.dimensions.width - this.dimensions.margins.right - width;
    }
    
    const startPosition = { ...this.currentPosition };
    
    this.doc.addImage(imgData, 'PNG', x, this.currentPosition.y, width, height);
    
    // Update position
    this.currentPosition.y += height;
    
    return {
      x: startPosition.x,
      y: startPosition.y,
      width,
      height
    };
  }

  /**
   * Create a section with background color
   */
  addSection(content: () => void, backgroundColor?: string): void {
    const startY = this.currentPosition.y;
    
    // Execute content
    content();
    
    // Add background if specified
    if (backgroundColor) {
      const endY = this.currentPosition.y;
      const height = endY - startY;
      
      this.doc.setFillColor(backgroundColor);
      this.doc.rect(
        this.dimensions.margins.left - 10,
        startY - 5,
        this.getContentWidth() + 20,
        height + 10,
        'F'
      );
    }
    
    this.addVerticalSpace(this.SECTION_SPACING);
  }

  /**
   * Get remaining space on current page
   */
  getRemainingPageSpace(): number {
    return this.getMaxContentHeight() - this.currentPosition.y;
  }

  /**
   * Check if content fits on current page
   */
  willFitOnPage(contentHeight: number): boolean {
    return this.currentPosition.y + contentHeight <= this.getMaxContentHeight();
  }

  /**
   * Add page numbers
   */
  addPageNumbers(): void {
    const pageHeight = this.doc.internal.pageSize.height;
    
    for (let i = 1; i <= this.pageCount; i++) {
      if (i > 1) {
        this.doc.setPage(i);
      }
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor('#718096');
      
      const pageText = `Página ${i} de ${this.pageCount}`;
      const textWidth = this.doc.getTextWidth(pageText);
      
      this.doc.text(
        pageText,
        this.dimensions.width - this.dimensions.margins.right - textWidth,
        pageHeight - 20
      );
    }
    
    // Return to first page
    this.doc.setPage(1);
  }

  /**
   * Get current page number
   */
  getCurrentPage(): number {
    return this.pageCount;
  }

  /**
   * Reset text color to default
   */
  resetTextColor(): void {
    this.doc.setTextColor('#000000');
  }
}
