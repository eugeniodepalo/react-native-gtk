import { Gtk } from "../../index.js"
import Widget from "./Widget.js"

export default class WindowHandle<
  T extends Gtk.WindowHandle,
> extends Widget<T> {
  createNode() {
    return new Gtk.WindowHandle({}) as T
  }
  appendChild(child: Widget<any>) {
    super.appendChild(child)
    this.node.setChild(child.node)
  }
  removeChild(child: Widget<any>) {
    super.removeChild(child)
    this.node.setChild(null)
  }
  insertBefore(child: Widget<any>, beforeChild: Widget<any>) {
    super.insertBefore(child, beforeChild)
    this.node.setChild(child.node)
  }
  set(propName: string, newValue: any, oldValue: any) {
    super.set(propName, newValue, oldValue)
    switch (propName) {
      case "accessibleRole":
        this.node.accessibleRole = newValue
        break
      case "onNotifyChild":
        this.setHandler("notify::child", newValue)
        break
      case "onNotifyAccessibleRole":
        this.setHandler("notify::accessible-role", newValue)
        break
    }
  }
}
