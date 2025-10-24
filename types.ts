
export interface Dimension {
  label: string;
  estimate: string;
}

export interface AnalysisResult {
  dimensions: Dimension[];
  annotatedImageSvg: string;
}
