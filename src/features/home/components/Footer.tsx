import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-fg-muted sm:flex-row">
        <p className="font-script text-xl text-fg">
          <span className="text-parda-green-500">Store</span>
          <span className="text-parda-lavender-500">Parda</span>
        </p>
        <p>&copy; {new Date().getFullYear()} StoreParda. Cloth store operating system.</p>
      </Container>
    </footer>
  );
}
