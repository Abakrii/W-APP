export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryButtonText?: string;
}
