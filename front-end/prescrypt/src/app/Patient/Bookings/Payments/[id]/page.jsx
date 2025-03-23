async function payment({ params }) {

    const {id} = await params
  return (
    <div>
        
        <h1>
           This is payment for:{id}

           </h1></div>
  )
}

export default payment