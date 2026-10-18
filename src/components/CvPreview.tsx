import DocumentPreview from "./DocumentPreview";

export default function CvPreview({ src, name }: { src: string; name: string }) {
  return (
    <DocumentPreview
      id="cv"
      src={src}
      name={name}
      label="CV"
      eyebrow="CURRICULUM VITAE"
      showOpenLink
    />
  );
}
