export function VersionBadge({version, pr}: {version?: string; pr?: string}) {
  return <span className="version-badge">{version}</span>;
}
