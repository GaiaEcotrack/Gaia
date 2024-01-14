import {Record} from "./Record"
import {Search} from "./Search"
import {Transaction} from "./Transaction"


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