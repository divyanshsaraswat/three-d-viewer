import { Editor } from "@tinymce/tinymce-react";
import { set, unset, useClient, useColorScheme, type TextInputProps } from "sanity";

const API_VERSION = "2025-01-01";

export function TinyMCEInput(props: TextInputProps) {
  const { value, onChange, elementProps } = props;
  const client = useClient({ apiVersion: API_VERSION });
  const { scheme } = useColorScheme();
  const isDark = scheme === "dark";

  return (
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
        height: 500,
        menubar: "file edit view insert format tools table",
        plugins:
          "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code insertdatetime media table paste help wordcount",
        toolbar: [
          "undo redo | blocks | bold italic | blockquote | bullist numlist | alignleft aligncenter alignright | link image removeformat",
          "fontfamily fontsize | outdent indent | pastetext | charmap | hr | forecolor | table | help",
        ],
        skin: isDark ? "oxide-dark" : "oxide",
        content_css: isDark ? "dark" : "default",
        images_upload_handler: (blobInfo) =>
          client.assets
            .upload("image", blobInfo.blob(), { filename: blobInfo.filename() })
            .then((doc) => doc.url),
      }}
    />
  );
}

export default TinyMCEInput;
