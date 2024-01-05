export const saveFlow = async (content: string) => {
  return new Promise((resolve) => {
    // if save to db success
    resolve(content)
  })
}

export const updateFlow = async (content: string, id: number) => {
  return new Promise((resolve) => {
    // if save to db success
    console.log(id)
    resolve(content)
  })
}

export const getFlowList = async () => {
  return new Promise((resolve) => {
    // get all flow
    resolve('Ok')
  })
}

export const getFlow = async (id: number) => {
  return new Promise((resolve) => {
    // get flow with id
    resolve(id)
  })
}

export const delFlow = async (id: number) => {
  return new Promise((resolve) => {
    // del flow with id
    resolve(id)
  })
}
