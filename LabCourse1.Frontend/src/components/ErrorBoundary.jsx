import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false, error:null } }
  static getDerivedStateFromError(error){ return { hasError:true, error } }
  componentDidCatch(error, info){ console.error('UI ErrorBoundary:', error, info) }
  render(){
    if(this.state.hasError){
      return <div className="container-wide py-10">
        <h2 className="text-2xl font-bold mb-3">Diçka shkoi keq në UI</h2>
        <p className="text-gray-600 text-sm">Rifresko faqen ose kthehu tek Ballina.</p>
      </div>
    }
    return this.props.children
  }
}
