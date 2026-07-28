import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { set, unset, useClient, useColorScheme, type TextInputProps } from "sanity";
import { Box, Button, Dialog } from "@sanity/ui";
import { Maximize2 } from "lucide-react";

const API_VERSION = "2025-01-01";

export function TinyMCEInput(props: TextInputProps) {
  const { value, onChange, elementProps } = props;
  const client = useClient({ apiVersion: API_VERSION });
  const { scheme } = useColorScheme();
  const isDark = scheme === "dark";
  const [isExpanded, setIsExpanded] = useState(false);

  const editor = (
    <Editor
      // Remount on scheme change: TinyMCE's skin/content_css aren't reactive after init.
      key={scheme}
      id={elementProps.id}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      value={value || ""}
      onEditorChange={(content) => {
        onChange(content ? set(content) : unset());
      }}
      init={{
        height: isExpanded ? "calc(100vh - 260px)" : 500,
        menubar: "file edit view insert format tools table",
        plugins:
          "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code insertdatetime media table paste help wordcount",
        toolbar: [
          "undo redo | blocks | bold italic | blockquote | bullist numlist | alignleft aligncenter alignright | link image removeformat",
          "fontfamily fontsize | outdent indent | pastetext | charmap | hr | forecolor | table | help",
        ],
        skin: isDark ? "oxide-dark" : "oxide",
        content_css: isDark ? "dark" : "default",
        // Every page (via AppShell's root wrapper and each page's own <main>)
        // applies Tailwind's `font-sans` utility, which globals.css wires to
        // `--font-geist-sans` — that's the font that actually renders on the
        // published post, not the OS default. Load it into the editor iframe
        // so "System Font" matches reality.
        content_style:
          "@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');" +
          "body { font-family: 'Geist', sans-serif; }",
        // Toolbar shows "System Font" as the inherited default, but TinyMCE's
        // built-in font list has no entry to select back to it once changed —
        // add one explicitly so it's a real, reselectable option. Also list
        // Geist and Inter by name (both used on the site) so either can be
        // picked directly, not just via the "System Font" alias.
        font_family_formats:
          "System Font=Geist,sans-serif;" +
          "Geist=Geist,sans-serif;" +
          "Inter=Inter,sans-serif;" +
          "Andale Mono=andale mono,times;" +
          "Arial=arial,helvetica,sans-serif;" +
          "Arial Black=arial black,avant garde;" +
          "Book Antiqua=book antiqua,palatino;" +
          "Comic Sans MS=comic sans ms,sans-serif;" +
          "Courier New=courier new,courier;" +
          "Georgia=georgia,palatino;" +
          "Helvetica=helvetica;" +
          "Impact=impact,chicago;" +
          "Symbol=symbol;" +
          "Tahoma=tahoma,arial,helvetica,sans-serif;" +
          "Terminal=terminal,monaco;" +
          "Times New Roman=times new roman,times;" +
          "Trebuchet MS=trebuchet ms,geneva;" +
          "Verdana=verdana,geneva;" +
          "Webdings=webdings;" +
          "Wingdings=wingdings,zapf dingbats",
        images_upload_handler: (blobInfo) =>
          client.assets
            .upload("image", blobInfo.blob(), { filename: blobInfo.filename() })
            .then((doc) => doc.url),
      }}
    />
  );

  if (isExpanded) {
    return (
      <Dialog
        id="tinymce-expand-dialog"
        header="Body"
        width={5}
        onClose={() => setIsExpanded(false)}
        onClickOutside={() => setIsExpanded(false)}
      >
        <Box padding={4}>{editor}</Box>
      </Dialog>
    );
  }

  return (
    <Box>
      <Box style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <Button
          mode="bleed"
          icon={Maximize2}
          text="Expand editor"
          fontSize={1}
          padding={2}
          onClick={() => setIsExpanded(true)}
        />
      </Box>
      {editor}
    </Box>
  );
}

export default TinyMCEInput;
