import Record from "../Record/Record"
import Search from "../Search/Search"
import {Transaction} from "../Transaction/Transaction"


function ViewTransactions  () {
  return (
    <div>
        <Transaction/>
        <Search/>
        <Record/>
    </div>
  )
}

export  {ViewTransactions}