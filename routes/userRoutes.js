const express = require('express');
const router = express.Router();

const User = require('../models/user')
const Lecture = require('../models/lectureTable');
const Tables = require('../models/tables')
const Post = require('../models/post')

router.post('/post',async(req,res)=>{
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json({message:'Post has been published'})

    } catch (error) {
        console.log('Error happend')
    }
})
router.get('/post/:tags',async(req,res)=>{
   const tags =  JSON.parse(decodeURIComponent(req.params.tags));
    try {
        const post = await  Post.find();
        const posts = [...post.filter(p=>p.tages.map(t=>tags.includes(t)).includes(true))]
        res.status(201).json(posts)

    } catch (error) {
        console.log('Error happend')
    }
});

router.get('/tables',async(req,res)=>{
  try {
    const table = await Tables.findById('65661e6f468b07fb99113ae8')
  res.status(200).json(table.lecturesTable);

  } catch (error) {
    console.log(error)
  }
  
})


router.get('/tables',async(req,res)=>{
 const table = await Tables.find()
 res.status(200).json(table)
})


router.get('/:email', async(req,res)=>{
    try {
        const user =await  User.findOne({email:req.params.email})
        res.status(200).json(user)
        
    } catch (error) {
        res.status(400).json({message:'Something went wrong',err:error})
    }
})

router.post('/',async(req,res)=>{
    try{
        const exist = await User.findOne({email:req.body.email});
        if(exist){
            res.status(401).send('User already existed');
            return;
        }
        const user = new User(req.body)
        await user.save()
        res.status(200).json(user)
    }
    catch(err){
        res.status(400).send(req.body)
    }
})


router.post('/group',async(req,res)=>{
    let m3 = []
    for(const b of req.body.name ){m3 = [...m3,...b.filter(a=>!m3.includes(a))]}
    try {
        for(const a of m3 ){
      
        const group = new Lecture({name:a})
        await group.save(); 
    }
    res.status(200).json({message:`Groups are  created`})
    } catch (error) {
        res.status(500).json({message:'Some thing wrong happend'})
    }
    
})


// Function to add a user to multiple groups
async function addUserToGroups(userId, groupNames,fullItemsArray) {
  console.log(groupNames, userId,fullItemsArray );
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found');
        return;
      }
  
      // Find the groups by name
      const groups = await Lecture.find({ name: { $in: groupNames } });
  
      if (groups.length !== groupNames.length) {
        console.log('One or more groups not found');
        return;
      } 
  
      
      let dontAdd = false;
      const newGroups = groupNames.filter(a=>!user.groups.includes(a));
      const groupsNew = groups.filter(a=>!newGroups.includes(a.name));

      for (const item of groupsNew){ 
        if(item.students.length>=item.maxMembers){
            dontAdd = true;
            fullItemsArray=[...fullItemsArray,item?.name] // I need to make sure if the groups has the proerty name ?
        }
    }

    const allOld = user?.groups.filter(a=>!groupNames.includes(a))
    console.log(dontAdd,allOld.length)
    if(!dontAdd && allOld.length === 0){
        // Add the user to each group's members array
      for (const group of groups) {
        if(!group.students.includes(userId)){
        group.students.push(userId);
        await group.save();
        }
       
      }
  
      // Add the groups to the user's groups array
      user.groups.push(...newGroups);
      await user.save();
  
      console.log('User added to groups successfully');
    }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  // Express route to add a user to multiple groups
  router.post('/addUserToGroups', async (req, res) => {
    let fullItemsArray = [];
    const {groupNames ,userId} = req.body;
    if (!userId || !groupNames || !Array.isArray(groupNames)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
  
    try {
      await addUserToGroups(userId, groupNames, fullItemsArray);
      if(fullItemsArray.length>0){res.status(201).json(fullItemsArray)}else{
        res.status(200).json({ message: 'User added to groups successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  
  
module.exports = router;