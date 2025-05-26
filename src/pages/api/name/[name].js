// pages\api\name\[name].js  

import item from '../../../data/item.json'
const nameHandle = (req, res) => {
    if (req.method) {
      try {
        const { name } = req.query;
        const items = item.find((items => items.id === parseInt(name)));
        res.status(200).json(items)
        console.log(items)
      } catch(err) {
        res.status(404).json({"message": `please try again: ${err}`})
      }
    }
}

export default nameHandle;