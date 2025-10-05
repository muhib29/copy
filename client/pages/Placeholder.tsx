export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="container py-20">
      <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        This page is a placeholder. Tell me what you want here and I will build it next.
      </p>
    </div>
  );
}
