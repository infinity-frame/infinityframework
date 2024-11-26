export function log(message: any, issuer?: string) {
  const prefix = `[${issuer || "GENERIC"} ${new Date().toISOString()}] I: `;
  process.stdout.write(prefix);
  console.log(message);
}

export function warn(message: any, issuer?: string) {
  const prefix = `[${issuer || "GENERIC"} ${new Date().toISOString()}] W: `;
  process.stderr.write(prefix);
  console.log(message);
}

export function error(message: any, issuer?: string) {
  const prefix = `[${issuer || "GENERIC"} ${new Date().toISOString()}] E: `;
  process.stderr.write(prefix);
  console.error(message);
}
