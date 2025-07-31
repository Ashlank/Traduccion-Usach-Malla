export const getData = (): number[] => {
  const data = localStorage.getItem('approved')
  if(data) return JSON.parse(data)
  return []
}

export const saveData = (data: number[]) => {
  localStorage.setItem('approved', JSON.stringify(data))
}