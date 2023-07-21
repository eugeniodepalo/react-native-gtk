import { camelize } from "../helpers"

export default function (widgetClass) {
  let ts = ""

  ts += `import ${widgetClass.import_.name} from "${widgetClass.import_.moduleName}"\n`
  ts += `import ${widgetClass.parentImport.name} from "${widgetClass.parentImport.moduleName}"\n`

  if (widgetClass.isContainer) {
    ts += `import AnyWidget from "../../widget.js"\n`
  }

  ts += `\n`
  ts += `export default class ${widgetClass.name}<`
  ts += `  T extends ${widgetClass.type.name} = ${widgetClass.type.name}`
  ts += `> `
  ts += `extends ${widgetClass.parentImport.name}<T> {\n`
  ts += `  createNode() {\n`
  ts += `    return new ${widgetClass.type.name}({\n`

  for (const prop of widgetClass.constructOnlyProps) {
    ts += `${prop.name}: this.props.${prop.name},\n`
  }

  ts += `  }) as T\n`
  ts += `}\n`

  if (widgetClass.isContainer) {
    ts += `appendChild(child: AnyWidget) {\n`
    ts += `  super.appendChild(child)\n`
    ts += `  this.node.setChild(child.node)\n`
    ts += `}\n`
    ts += `removeChild(child: AnyWidget) {\n`
    ts += `  super.removeChild(child)\n`
    ts += `  this.node.setChild(null)\n`
    ts += `}\n`
    ts += `insertBefore(child: AnyWidget, beforeChild: AnyWidget) {\n`
    ts += `  super.insertBefore(child, beforeChild)\n`
    ts += `  this.node.setChild(child.node)\n`
    ts += `}\n`
  }

  ts += `set(propName: string, newValue: any) {\n`
  ts += `  super.set(propName, newValue)\n`
  ts += `  switch (propName) {\n`

  for (const prop of widgetClass.settableProps) {
    if (widgetClass.isContainer && prop.name === "child") {
      continue
    }

    ts += `case "${prop.name}":\n`

    if (prop.name === "page" && widgetClass.name === "Notebook") {
      ts += `if (this.node.getCurrentPage() !== newValue) {\n`
      ts += `  this.node.setCurrentPage(newValue)\n`
    } else {
      const getter = prop.getter
        ? `this.node.${prop.getter}()`
        : `this.node.${prop.name}`

      const setter = prop.setter
        ? `this.node.${prop.setter}(newValue)`
        : `this.node.${prop.name} = newValue`

      ts += `if (${getter} !== newValue) {\n`
      ts += `  ${setter}\n`
    }

    ts += `  }\n`
    ts += `break\n`
  }

  for (const signal of widgetClass.signals) {
    ts += `      case "${signal.name}":\n`
    ts += `        this.setHandler("${signal.rawName}", newValue)\n`
    ts += `        break\n`
  }

  for (const prop of widgetClass.props) {
    ts += `      case "${camelize(`on_notify_${prop.rawName}`)}":\n`
    ts += `        this.setHandler("notify::${prop.rawName}", newValue)\n`
    ts += `        break\n`
  }

  ts += `      default:\n`
  ts += `        break\n`
  ts += `    }\n`
  ts += `  }\n`
  ts += `}\n`

  return ts
}
