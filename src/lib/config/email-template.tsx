// components
import {
  Hr,
  Img,
  Html,
  Head,
  Body,
  Text,
  Button,
  Preview,
  Section,
  Tailwind,
  Container,
} from "@react-email/components"

interface Props {
  token?: string
  verification?: boolean
  resetPassword?: boolean
  resetPasswordLink?: string
  changedEmail?: "ChangedEmail" | undefined
  userName?: string
  companyName?: string
  companyLogo?: string
}

const EmailTemplate = ({
  resetPasswordLink,
  companyName = "Tagumlistings",
  companyLogo = "https://ik.imagekit.io/mutd5f1xb/android-chrome-512x512.png?updatedAt=1728439897900",
}: Props) => {
  const commonConfig = {
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: "#31E62BFF",
            dark: "#31E62BFF",
            light: "#31E62BFF",
          },
          background: {
            light: "#f8fafc",
            dark: "#1e293b",
          },
        },
      },
    },
  }

  return (
    <Html>
      <Head />
      <Preview>Reset Your Password</Preview>
      <Tailwind config={commonConfig}>
        <Body className="mx-auto bg-background-light font-sans">
          <Container className="mx-auto my-8 max-w-[600px] rounded-xl bg-white p-8">
            {/* Logo Section */}
            <Section className="text-center">
              {companyLogo && (
                <Img
                  src={companyLogo}
                  alt={`${companyName} logo`}
                  width="48"
                  height="48"
                  className="mx-auto mb-6"
                />
              )}
            </Section>

            {/* Header Section */}
            <Section className="mb-8 text-center">
              <Text className="m-0 text-2xl font-bold text-brand">
                Reset Your Password
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="text-base text-gray-700">
                We received a request to reset your password. Click the button
                below to choose a new password:
              </Text>

              {/* Reset Password Button */}
              <Section className="my-8 text-center">
                <Button
                  href={resetPasswordLink}
                  className="inline-block rounded-lg bg-brand px-6 py-3 text-base font-semibold text-white no-underline"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-sm text-gray-600">
                This link will expire in 3 minutes. If you didn't request a
                password reset, you can safely ignore this email.
              </Text>
            </Section>

            <Hr className="my-8 border-gray-200" />

            {/* Security Notice */}
            <Section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <Text className="m-0 mb-2 text-sm font-semibold text-gray-700">
                Security Notice
              </Text>
              <Text className="m-0 text-xs text-gray-600">
                For your security, we never ask for your password, financial
                details, or sensitive information via email. If you didn't
                request this password reset, please contact support immediately.
              </Text>
            </Section>
          </Container>

          {/* Footer */}
          <Container className="mx-auto max-w-[600px] px-8 py-4">
            <Text className="m-0 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} {companyName}. All rights reserved.
            </Text>
            <Text className="m-0 mt-2 text-center text-xs text-gray-500">
              This is an automated message, please do not reply to this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default EmailTemplate
