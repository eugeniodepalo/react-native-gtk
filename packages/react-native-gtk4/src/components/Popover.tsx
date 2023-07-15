import React, { useEffect, useImperativeHandle, useState } from "react"
import { forwardRef } from "react"
import { Gtk } from "../index.js"

const Popover = "Popover"

type Props = JSX.IntrinsicElements["Popover"] & {
  children: React.ReactNode
  content: React.ReactElement<JSX.IntrinsicElements["Widget"]>
  open?: boolean
}

export default forwardRef<Gtk.Popover, Props>(function PopoverComponent(
  { children, content, open = false, ...props },
  ref
) {
  const [popoverNode, setPopoverNode] = useState<Gtk.Popover | null>(null)
  const [contentNode, setContentNode] = useState<Gtk.Widget | null>(null)

  const contentRef = (node: Gtk.Widget | null) => {
    setContentNode(node)
  }

  const contentWithRef = React.cloneElement(content, {
    ref: contentRef,
  })

  useImperativeHandle(ref, () => popoverNode!)

  const popoverRef = (node: Gtk.Popover | null) => {
    setPopoverNode(node)
  }

  useEffect(() => {
    if (!popoverNode || !contentNode || !popoverNode.child) {
      return
    }

    if (open) {
      popoverNode.popup()
    } else {
      popoverNode.popdown()
    }
  }, [popoverNode, contentNode, open])

  return (
    <>
      <Popover ref={popoverRef} {...props}>
        {children}
      </Popover>
      {contentWithRef}
    </>
  )
})
