import Task from "../models/Task.js";

export const showTask = async (req, res) => {
    try {
        //Hiện toàn bộ Task ra từ ngày mới nhất
        const task = await Task.find().sort({ createdAt: 'desc' });

        res.status(200).json({
            message: 'Show Tasks Success',
            data: task
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createTask = async (req, res) => {
    try {
        //Kiểm tra input title có để trống không
        const { title } = req.body;
        if(!title) {
            return res.status(400).json({ message: 'Title is not empty'});
        }

        //Kiểm tra title đã tồn tại chưa
        const duplicate = await Task.findOne({title});
        if(duplicate) {
            return res.status(409).json({ message: 'Title already exists'});
        }
 
        //Tạo Task
        const task = new Tasks(req.body);
        await task.save();

        res.status(201).json({ message: 'Create Task Success' });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

export const editTask = async (req, res) => {
    try {
        //Kiểm tra id có tồn tại chưa
        const { id } = req.params;
        const task = await Task.findById(id);
        
        if(!task) {
            return res.status(404).json({ message: `Task ${id} Not Found` });
        }

        //Nếu có id thì cho phép chỉnh sửa
        res.status(200).json({
            message: `Task have ${id}`,
            data: task
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, status } = req.body;

        //Kiểm tra input status có để trống không
        if(!status) {
            return res.status(400).json({ message: 'Status must not be empty'});
        }

        //Kiểm tra status có nằm trong Array không
        const STATUS = {
            TODO: 'To Do',
            IN_PROGRESS: 'In Progress',
            DONE: 'Done'
        };

        if(!Object.values(STATUS).includes(status)) {
            return res.status(400).json({ message: 'Status value are To Do or In Progress or Done' });
        }

        //Kiểm tra id đã tồn tại chưa
        const task = await Task.findById(id);

        if(!task) {
            return res.status(404).json({ message: `Not have Task ${id}` });
        }
 
        //Update task theo id (description, status)
        task.description = description;
        task.status = status;

        //Nếu Status là Done thì sẽ tạo ra completedAt
        if(status === STATUS.DONE) {
            task.completedAt = new Date();
        } else {
            delete task.completedAt;
        }

        await task.save();
        res.status(200).json({ message: 'Update Task Success', data: task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTask = async (req, res) => {
    try {
        //Kiểm tra id có tồn tại chưa
        const { id } = req.params;

        //Delete task theo id
        const task = await Task.findByIdAndDelete(id);

        if(!task) {
            return res.status(404).json({ message: `Task ${id} Not Found` });
        }
        
        res.status(200).json({ message: 'Delete Task Success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const sortTask = async (req, res) => {
    try {
        //Tạo sort để query
        const { sort, order } = req.query;
        let option = {};
        
        if(sort) {
            option[sort] = order === 'desc' ? 'desc' : 'asc';
        }

        //Query xong rồi sort
        const task = await Task.find().sort(option);

        res.status(200).json({ message: 'Sort Task Success', data: task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const pagination = async (req, res) => {
    try {
        //1 Page giới hạn 2 Tasks
        let { page = 1, limit = 2 } = req.query;

        //Query là String nên dùng parseInt để đổi thành Number
        page = parseInt(page);
        limit = parseInt(limit);

        //Kiểm tra Page hoặc Limit có NaN không
        if(isNaN(page) || isNaN(limit)) {
            return res.status(400).json({ message: 'Invalid pagination values' });
        }

        //Bỏ qua Limit Task đầu để lấy Limit Task kế tiếp
        const skip = (page - 1) * limit;

        const task = await Task.find()
                                .skip(skip)
                                .limit(limit);

        res.status(200).json({
            message: 'Pagination Task Success',
            page,
            limit,
            data: task
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}