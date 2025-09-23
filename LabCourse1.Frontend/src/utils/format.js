export const money = (n)=> new Intl.NumberFormat(undefined,{style:'currency',currency:'USD'}).format(n||0)
