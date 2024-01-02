import { Dispatch, SetStateAction } from 'react'
import { Node } from 'reactflow'

type condition = {
  temperature: number
  solvet: number
  score: number
  reagent: string
  solvent: string
  catalyst: string
}

export type ChemNodeData = {
  isTarget?: boolean | undefined
  isLeaf?: boolean | undefined
  imgUrl: string
}

export type ReactNodeData = {
  condition: string
  reactants: string
  product: string
  detail?: string
}

export type NodeProps = {
  currentNode: Node
  setRoutes: Dispatch<SetStateAction<never[]>>
}

export type RouteProps = {
  currentNode: Node
  setConditions: Dispatch<SetStateAction<never[]>>
  selectCondition: condition
}
