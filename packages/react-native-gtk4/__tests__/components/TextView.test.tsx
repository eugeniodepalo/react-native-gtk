import React, { createRef } from "react"
import { render, setup, findBy } from "@/test-support/index.js"
import TextView from "@/components/TextView.js"
import Gtk from "@/generated/girs/node-gtk-4.0.js"
import { Box } from "@/generated/intrinsics.js"

describe("TextView", () => {
  beforeEach(setup)

  describe("Container", () => {
    test("should render", () => {
      render(
        <TextView.Container>
          <Box />
        </TextView.Container>
      )

      const textView = findBy({ type: "TextView" })
      const child = findBy({ type: "Box" })

      expect(textView.node).toBeInstanceOf(Gtk.TextView)
      expect(child.node).toBeInstanceOf(Gtk.Box)
    })

    test("should forward refs", () => {
      const ref = createRef<Gtk.TextView>()
      const childRef = createRef<Gtk.Box>()

      render(
        <TextView.Container ref={ref}>
          <Box ref={childRef} />
        </TextView.Container>
      )

      const textView = findBy({ type: "TextView" })
      const child = findBy({ type: "Box" })

      expect(ref.current).toBe(textView.node)
      expect(childRef.current).toBe(child.node)
    })

    test("should handle unmount gracefully", () => {
      render(
        <TextView.Container>
          <Box />
        </TextView.Container>
      )

      render(null)

      const textView = findBy({ type: "TextView" })
      const child = findBy({ type: "Box" })

      expect(textView).toBeNull()
      expect(child).toBeNull()
    })
  })

  describe("Overlay", () => {
    test("should render", () => {
      render(
        <TextView.Container>
          <TextView.Overlay>
            <Box />
          </TextView.Overlay>
        </TextView.Container>
      )

      const textView = findBy({ type: "TextView" })
      const child = findBy({ type: "Box" })

      expect(textView.node).toBeInstanceOf(Gtk.TextView)
      expect(child.node).toBeInstanceOf(Gtk.Box)
    })

    test("should forward refs", () => {
      const ref = createRef<Gtk.Box>()

      render(
        <TextView.Container>
          <TextView.Overlay>
            <Box ref={ref} />
          </TextView.Overlay>
        </TextView.Container>
      )

      const child = findBy({ type: "Box" })

      expect(ref.current).toBe(child.node)
    })

    test("should add overlay at specified position", () => {
      const x = 10
      const y = 20

      render(
        <TextView.Container>
          <TextView.Overlay x={x} y={y}>
            <Box />
          </TextView.Overlay>
        </TextView.Container>
      )

      const textView = findBy<Gtk.TextView>({ type: "TextView" })
      const child = findBy({ type: "Box" })

      expect(textView.node.addOverlay).toHaveBeenCalledWith(child.node, x, y)
    })

    test("should remove overlay when unmounted", () => {
      const x = 10
      const y = 20

      render(
        <TextView.Container>
          <TextView.Overlay x={x} y={y}>
            <Box />
          </TextView.Overlay>
        </TextView.Container>
      )

      const textView = findBy<Gtk.TextView>({ type: "TextView" })
      const child = findBy({ type: "Box" }) as any

      child.node.parent = textView.node

      render(null)

      expect(textView.node.remove).toHaveBeenCalledWith(child.node)
    })

    test("should throw when not inside TextView.Container", () => {
      expect(() => {
        render(
          <TextView.Overlay>
            <Box />
          </TextView.Overlay>
        )
      }).toThrow("TextView.Overlay must be a child of TextView.Container")
    })
  })

  describe("Anchor", () => {
    test("should render", () => {
      const anchor = new Gtk.TextChildAnchor()

      render(
        <TextView.Container>
          <TextView.Anchor anchor={anchor}>
            <Box />
          </TextView.Anchor>
        </TextView.Container>
      )

      const textView = findBy({ type: "TextView" })
      const child = findBy({ type: "Box" })

      expect(textView.node).toBeInstanceOf(Gtk.TextView)
      expect(child.node).toBeInstanceOf(Gtk.Box)
    })

    test("should add child at specified anchor", () => {
      const anchor = new Gtk.TextChildAnchor()

      render(
        <TextView.Container>
          <TextView.Anchor anchor={anchor}>
            <Box />
          </TextView.Anchor>
        </TextView.Container>
      )

      const textView = findBy<Gtk.TextView>({ type: "TextView" })
      const child = findBy({ type: "Box" })

      expect(textView.node.addChildAtAnchor).toHaveBeenCalledWith(
        child.node,
        anchor
      )
    })

    test("should remove child when unmounted", () => {
      const anchor = new Gtk.TextChildAnchor()

      render(
        <TextView.Container>
          <TextView.Anchor anchor={anchor}>
            <Box />
          </TextView.Anchor>
        </TextView.Container>
      )

      const textView = findBy<Gtk.TextView>({ type: "TextView" })
      const child = findBy({ type: "Box" }) as any

      child.node.parent = textView.node

      render(null)

      expect(textView.node.remove).toHaveBeenCalledWith(child.node)
    })

    test("should throw when not inside TextView.Container", () => {
      const anchor = new Gtk.TextChildAnchor()

      expect(() => {
        render(
          <TextView.Anchor anchor={anchor}>
            <Box />
          </TextView.Anchor>
        )
      }).toThrow("TextView.Anchor must be a child of TextView.Container")
    })
  })
})
