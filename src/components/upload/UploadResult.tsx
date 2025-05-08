interface UploadResultProps {
  result: {
    success?: boolean;
    error?: string;
    md5?: string;
  } | null;
}

export function UploadResult({ result }: UploadResultProps) {
  if (!result) return null;

  if (result.success) {
    return (
      <div className="text-sm text-green-600 dark:text-green-400">
        Upload successful! Book MD5: <span className="font-mono">{result.md5}</span>
      </div>
    );
  }

  if (result.error) {
    return <div className="text-sm text-red-600 dark:text-red-400">{result.error}</div>;
  }

  return null;
}
