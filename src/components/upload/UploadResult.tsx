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

export function BulkUploadResult({ results }: { results: Array<{ success?: boolean; error?: string; md5?: string } | null | undefined> }) {
  if (!results || results.length === 0) return null;

  const successCount = results.filter((r) => r?.success).length;
  const failCount = results.filter((r) => r?.error).length;

  return (
    <div className="mt-4 rounded-md border p-4">
      <h3 className="mb-2 font-medium">Upload Results</h3>
      <div className="text-sm">
        <span className="text-green-600 dark:text-green-400">{successCount} successful</span>
        {failCount > 0 && <span className="ml-4 text-red-600 dark:text-red-400">{failCount} failed</span>}
      </div>

      {failCount > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          <details>
            <summary className="cursor-pointer">Show failed uploads</summary>
            <ul className="ml-4 mt-2 list-disc">
              {results.map((result, index) =>
                result?.error ? (
                  <li key={index} className="text-red-600 dark:text-red-400">
                    {result.error}
                  </li>
                ) : null,
              )}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
