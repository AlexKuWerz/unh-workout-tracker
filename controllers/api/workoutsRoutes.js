const router = require('express').Router();
const { Workout } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const workoutsData = await Workout.findOne()
            .sort({
                day: -1,
            });

        if (workoutsData) {
            Workout.aggregate([
                {
                    $match: {
                        _id: workoutsData._id,
                    },
                },
                {
                    $addFields: {
                        totalDuration: {
                            $sum: '$exercises.duration',
                        },
                    },
                },
            ], (err, data) => {
                res.status(200).json(data);
            });
        } else {
            res.json({});
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const workoutsData = await Workout.create(req.body);

        res.status(200).json(workoutsData);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const workoutsData = await Workout.findOneAndUpdate({
            _id: req.params.id,
        }, {
            $push: {
                exercises: req.body,
            },
        });

        res.status(200).json(workoutsData);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/range', (req, res) => {
    try {
        Workout.aggregate([
            {
                $addFields: {
                    totalDuration: {
                        $sum: '$exercises.duration',
                    },
                },
            }
        ], (err, data) => {
            res.status(200).json(data);
        })
        .sort({
            day: -1,
        })
        .limit(7);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
