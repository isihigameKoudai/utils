import { query } from "@anthropic-ai/claude-code";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: npm run claude \"your prompt here\"");
  process.exit(1);
}

const prompt = args.join(" ");

(async () => {
  const queryIterator = query({
    prompt,
    abortController: new AbortController(),
  });

  for await (const message of queryIterator) {
    console.log('*');
    // 成功結果の場合は表示して終了
    const isSuccessResult = message.type === "result" && !message.is_error && message.subtype === "success";
    if (isSuccessResult) {
      console.log(message.result);
      break;
    }
  }
})();
