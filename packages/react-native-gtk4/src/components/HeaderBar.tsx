import React, { useCallback, useImperativeHandle, useRef } from "react"
import { forwardRef } from "react"
import Gtk from "@girs/node-gtk-4.0"
import { HeaderBar } from "../generated/intrinsics.js"
import usePortal from "../hooks/usePortal.js"

type Props = Omit<JSX.IntrinsicElements["HeaderBar"], "title"> & {
  children: React.ReactNode
  title?: React.ReactElement<JSX.IntrinsicElements["Widget"]> | null
}

export default forwardRef<Gtk.HeaderBar, Props>(function HeaderBarComponent(
  { title, ...props },
  ref
) {
  const titleRef = useRef<Gtk.Widget | null>(null)
  const headerBarRef = useRef<Gtk.HeaderBar | null>(null)

  useImperativeHandle(ref, () => headerBarRef.current!)

  const commitMount = useCallback(() => {
    if (!headerBarRef.current) {
      return
    }

    headerBarRef.current.setTitleWidget(titleRef.current)
  }, [])

  const setHeaderBarRef = useCallback((node: Gtk.HeaderBar | null) => {
    headerBarRef.current = node
    commitMount()
  }, [])

  const setTitleRef = useCallback((node: Gtk.Widget | null) => {
    titleRef.current = node
    commitMount()
  }, [])

  usePortal(
    title
      ? React.cloneElement(title, {
          ref: setTitleRef,
        })
      : null
  )

  return <HeaderBar ref={setHeaderBarRef} {...props} />
})
