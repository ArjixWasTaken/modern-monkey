import { Result, Ok, Err } from "ts-results";

export const parseHeader = (text: string): Result<Record<string, unknown>, string> => {
   const lines = text
      .split("\n")
      .filter((x) => x.trim())
      .map((line, idx) => [line.trim(), idx] as const);
   const comments: { byIndex: number[]; byValue: string[] } = {
      byIndex: [],
      byValue: [],
   };

   for (const [line, idx] of lines.filter((x) => x[0].trim().startsWith("//"))) {
      comments.byIndex.push(idx);
      comments.byValue.push(line.trim().substring(2).trim());
   }

   const startIndex = comments.byValue.findIndex((line) => line === "==UserScript==");
   const endIndex = comments.byValue.findIndex((line) => line === "==/UserScript==");
   if (startIndex < 0 || endIndex < 0) return Err("UserscriptHeader: Missing start or end of header.");

   const headerStart = lines[comments.byIndex[startIndex]][1];
   const headerEnd = lines[comments.byIndex[endIndex]][1];

   const headerLines = lines.slice(headerStart + 1, headerEnd);
   if (headerLines.some(([_, idx]) => !comments.byIndex.includes(idx))) {
      return Err("UserscriptHeader: Non-comment line found in header.");
   }

   const header: any = {};
   for (const [line, _] of headerLines) {
      const [_, key, value] = line.match(/\s*\@(?<key>\w+)\s+(?<value>.+)\s*$/) ?? [];
      if (!key) continue;

      if (key in header) {
         if (!Array.isArray(header[key])) header[key] = [header[key]];
         header[key].push(value);
      } else header[key] = value;
   }

   return Ok(header);
};
