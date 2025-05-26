// pages\api\name\name.js

import item from '../../../data/item.json'

export default function handler(req, res) {
    res.status(200).json(item)
  }