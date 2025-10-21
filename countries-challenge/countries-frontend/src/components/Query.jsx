const Query = ({ searchQuery, handleQuery }) => {
  return (
    <div>
      find countires <input value={searchQuery} onChange={handleQuery} />
    </div>
  )
}

export default Query
