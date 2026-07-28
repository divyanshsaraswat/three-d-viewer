import { useState, type KeyboardEvent, type ClipboardEvent } from "react";
import { Badge, Box, Card, Flex, TextInput } from "@sanity/ui";
import { set, unset, type ArrayOfPrimitivesInputProps } from "sanity";
import { X } from "lucide-react";

function splitTags(raw: string): string[] {
  return raw
    .split(/[,\n]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function TagsInput(props: ArrayOfPrimitivesInputProps<string | number | boolean>) {
  const { onChange, readOnly } = props;
  const value = (props.value ?? []) as string[];
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const additions = splitTags(raw).filter((t) => !value.includes(t));
    onChange(additions.length ? set([...value, ...additions]) : unset());
    setDraft("");
  };

  const removeAt = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next.length ? set(next) : unset());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (draft.trim()) commit(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      removeAt(value.length - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (text.includes(",") || text.includes("\n")) {
      e.preventDefault();
      commit(draft + text);
    }
  };

  const handleBlur = () => {
    if (draft.trim()) commit(draft);
  };

  return (
    <Card border radius={2} padding={2} tone={readOnly ? "transparent" : undefined}>
      <Flex wrap="wrap" gap={2} align="center">
        {value.map((tag, i) => (
          <Badge key={`${tag}-${i}`} tone="primary" padding={2} radius={2}>
            <Flex align="center" gap={2}>
              {tag}
              {!readOnly && (
                <Box
                  as="button"
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label={`Remove ${tag}`}
                  style={{ display: "flex", background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}
                >
                  <X size={11} />
                </Box>
              )}
            </Flex>
          </Badge>
        ))}
        {!readOnly && (
          <Box flex={1} style={{ minWidth: 140 }}>
            <TextInput
              value={draft}
              onChange={(e) => setDraft(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onBlur={handleBlur}
              placeholder={value.length ? "Add tag…" : "Type a tag and press Enter or comma…"}
              border={false}
            />
          </Box>
        )}
      </Flex>
    </Card>
  );
}

export default TagsInput;
