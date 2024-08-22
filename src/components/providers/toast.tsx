"use client"

// components
import { CircleAlert, CircleCheckBig, Loader2 } from "lucide-react"

// utils
import { keyframes, styled } from "goober"
import type React from "react"

import toast, { Toaster, resolveValue } from "react-hot-toast"

// types
import type { ToastType } from "react-hot-toast"

interface ToastProps {
  type: ToastType
}

// init toast colors
const colors: Record<ToastType, string> = {
  success: "#16A34A",
  error: "#DC2626",
  loading: "#fbbf24",
  blank: "#A3A3A3",
  custom: "#094CC9",
}

// init get colors method
const getColor = (type: ToastType): string => {
  return colors[type] || colors.error
}

// init get background colors method
const getBackgroundColor = (type: ToastType): string => {
  return `${getColor(type)}20`
}

// set toast body using goober
const BaseToast = styled("div")<ToastProps>`
  background: #ffffff;
  border-radius: 10px;
  color: ${(p) => getColor(p.type)};
  display: flex;
  align-items: center;
  padding: 5px;
  padding-right: 10px;
  height: 50px;
  border: 2px solid ${(p) => getBackgroundColor(p.type)};
  width: auto;
  max-width: 100%;
`

// set toast content using goober
const Content = styled("div")`
  flex: 1;
  padding: 10px;
  text-align: left;
  word-wrap: break-word;
`

// set toast icon wrapper using goober
const IconWrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 0px;
  margin-left: 5px;
`

// set toast indicator using goober
const Indicator = styled("div")<ToastProps>`
  background: ${(p) => getColor(p.type)};
  border-radius: 99px;
  width: 5px;
  height: 100%;
  transition: all 0.2s ease-in-out;
`

// set toast dismiss button using goober
const DismissButton = styled("button")`
  width: 16px;
  height: 16px;
  font-size: 24px;
  display: flex;
  justify-items: center;
  align-items: center;
  background: transparent;
  padding: 12px;
  border: none;
  color: gray;
  &:hover {
    color: black;
  }
`

// set toast enter animation using goober
const enterAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
`

// set toast exit animation using goober
const exitAnimation = keyframes`
  from {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-30px) scale(0.8);
  }
`

// init toast icon setter
const getIcon = (type: ToastType): JSX.Element => {
  switch (type) {
    case "loading":
      return <Loader2 className="size-6 animate-spin text-yellow-600" />
    case "success":
      return <CircleCheckBig className="size-6 text-green-600" />
    case "error":
      return <CircleAlert className="size-6 text-red-600" />
    default:
      return <CircleAlert className="size-6 text-blue-600" />
  }
}

const ToastProvider: React.FC = () => {
  return (
    <Toaster position="top-center">
      {(t) => (
        <BaseToast
          type={t.type}
          style={{
            animation: t.visible
              ? `${enterAnimation} 0.2s ease-out forwards`
              : `${exitAnimation} 0.4s ease-in forwards`,
          }}
        >
          <Indicator type={t.type} />
          <IconWrapper>{getIcon(t.type)}</IconWrapper>
          <Content>{resolveValue(t.message, t)}</Content>
          {t.type !== "loading" && (
            <DismissButton onClick={() => toast.dismiss(t.id)}>
              &#215;
            </DismissButton>
          )}
        </BaseToast>
      )}
    </Toaster>
  )
}

export default ToastProvider
