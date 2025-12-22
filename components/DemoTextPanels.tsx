"use client";

import { useEffect, useState } from "react";

async function fetchText(url: string) {
  const res = await fetch(url);
  return await res.text();
}

export function DemoTextPanels(props: { inputUrl: string; scriptUrl?: string; outputUrl: string }) {
  const [input, setInput] = useState("");
  const [script, setScript] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    (async () => {
      setInput(await fetchText(props.inputUrl));
      if (props.scriptUrl) setScript(await fetchText(props.scriptUrl));
      setOutput(await fetchText(props.outputUrl));
    })();
  }, [props.inputUrl, props.scriptUrl, props.outputUrl]);

  const cols = props.scriptUrl ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 ${cols} gap-6`}>
      <section>
        <h2 className="font-semibold mb-2">Input</h2>
        <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-[520px] border">{input}</pre>
      </section>

      {props.scriptUrl && (
        <section>
          <h2 className="font-semibold mb-2">Command Script</h2>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-[520px] border">{script}</pre>
        </section>
      )}

      <section>
        <h2 className="font-semibold mb-2">Output</h2>
        <pre className="text-xs bg-black text-white p-3 rounded overflow-auto max-h-[520px] border">{output}</pre>
      </section>
    </div>
  );
}
