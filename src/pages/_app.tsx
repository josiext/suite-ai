import { Box, Link, Navbar, ThemeProvider } from "@suit-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Box className="min-h-screen">
        <Navbar variant="static">
          <Navbar.Brand className="font-semibold text-lg">
            LEGAL CLOUD
          </Navbar.Brand>
          <Navbar.Content className="justify-between">
            <Navbar.Group>
              <Navbar.Item>
                <Link href={`/`} variant="unstyled" className="text-neutral-50">
                  Legal AI
                </Link>
              </Navbar.Item>
              <Navbar.Item>
                <Link
                  href={`/project-manager`}
                  variant="unstyled"
                  className="text-neutral-50"
                >
                  Project Manager
                </Link>
              </Navbar.Item>
              <Navbar.Item>TimeBilling</Navbar.Item>
            </Navbar.Group>
          </Navbar.Content>
        </Navbar>

        <Box className="p-6 w-full h-full">
          <Component {...pageProps} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
