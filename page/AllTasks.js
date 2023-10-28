import React, { useContext, useEffect, useState } from 'react'
import { defer, useLoaderData, useSearchParams } from 'react-router-dom'
import { TaskAPI } from '../api/TaskAPI'
import { motion } from 'framer-motion'
import TaskComp from '../component/task/TaskComp'
import TaskEditor from '../component/task/TaskEditor'
import { AppContext } from '../App'
import { Common } from '../utility/Common'
import Dropdown from '../utility/Dropdown'
import "../css/allcomp.css";
import { ListAPI } from '../api/ListAPI'


export const allTasksLoader = () => {
    return defer({allTasks: TaskAPI.getAllTasks()});
}
const AllTasks = () => {

    const allTasksLoader = useLoaderData();

    const { TaskChangeEvent, updateTask, deleteTask, getTask } = useContext(AppContext);

    const [ editorState, setEditorState ] = useState({
        isOpen: false,
        taskId: -1,
        taskDetails: null
    });

    const [ filterMenus, setFilterMenus ] = useState();

    const [ seletedFilterptions, setSelectedFilterOptions ] = useState(null);

    const [ searchParams, setSearchParams ] = useSearchParams();

    useEffect(() => {
        handleSearchParams();
    }, [searchParams]);

    useEffect(() => {
        checkSeletedFilters();
    }, [filterMenus]);

    const handleSearchParams = async () => {
        if(searchParams.size) {
            let options = [];
            let idCounter = 0;

            let lists;
            let searchedLists = [];
            
            if(searchParams.has("list")) {
                searchedLists = searchParams.get("list").split(",").map(listId => parseInt(listId));
            }
            const response = await ListAPI.getAllListsOfUser();
            if(response.status !== 200) {
                Common.showErrorPopup(response.error, 2);
                return;
            }
            lists = response.lists;

            populateOptions(options, idCounter, lists);
            setSelectedFilterOptions(options);

            const listSelectOptions = lists.map(list => {
                return {
                    id: list.listId,
                    name: list.listName,
                    checked: searchedLists.includes(list.listId)
                }
            });
           
            const isCompleted = searchParams.has("Completed") ? searchParams.get("Completed") === "true" : false;
            const isYetToFinish = searchParams.has("YetToFinish") ? searchParams.get("YetToFinish") === "true" : false;
            setFilterMenus(getFilterOptionsWithList(listSelectOptions, isCompleted, isYetToFinish));
            console.log(getFilterOptionsWithList(listSelectOptions, isCompleted, isYetToFinish))
        }
    }

    const getFilterOptionsWithList = ( lists, isCompleted, isYetToFinish ) => {
        return [
            {
                id: 1,
                name: "Completed",
                checked: isCompleted
            },
            {
                id: 2,
                name: "Yet to finish",
                checked: isYetToFinish
            },
            {
                id: 3,
                name: "List",
                isCheckboxDropdown: true,
                subItems: lists
            }
        ]
    }

    const populateOptions = async (options, idCounter, lists) => {
        searchParams.forEach((value, key) =>{
            if(key === "list") {
                const listIds = value.split(",");
                listIds.forEach(listId => {
                    const list = lists.find(list => list.listId === parseInt(listId));
                    options.push({
                        id: idCounter,
                        name: list.listName,
                        value: listId
                    });
                });
            }
            else {
                options.push({
                    id: idCounter,
                    name: key,
                    value
                });
            }
            idCounter++;
        });
    }

    const openEditor = async id => {
        const taskResponse = await TaskAPI.getSingleTaskDetails(id);

        if(taskResponse.status !== 200) {
            Common.showErrorPopup(taskResponse.error, 2);
            return;
        }
        setEditorState({
            isOpen: true,
            taskId: id,
            taskDetails: taskResponse.task
        });
    }
    const closeEditor = () => {
        setEditorState(prev => {
            return {
                ...prev,
                isOpen: false
            }
        });
    }

    const notifyTaskChange = async (data, mode, shouldFetch) => {
        if(shouldFetch) {
            data = await getTask(data);
        }
        if(!data) return;

        TaskChangeEvent.current.forEach(listener => {
            listener.callback(data, mode);
        });
    }

    const allTasksPredicate = () => {
        return false;
    }

    const checkSeletedFilters = () => {
        const filtered = [];

        filterMenus && filterMenus.forEach((menu, index) => {
            if(menu.checked) {
                // This check will be done for "Completed" and "Yet To Finish"
                filtered.push({id: menu.id, name: menu.name});
            }
            else if (menu.subItems) {
                // This check will be done for "lists" dropdown
                menu.subItems.forEach(list => {
                    if(list.checked) {
                        filtered.push({id: list.id, name: list.name});
                    }
                })
            }
        });
        setSelectedFilterOptions(filtered);
    }

    const handleFilterDropDownOption = option => {
        // TODO Need to makes these strings as constants
        if(option.name === "Yet to finish" || option.name === "Completed") {
            setFilterMenus(prev => {
                prev.forEach(p => {
                    if(p.id === option.id) {
                        p.checked = !p.checked;
                    }
                });
                console.log(prev);
                return [...prev];
            });
        }   
        else {
            checkSeletedFilters();
        }
    }

    const seletedFilterptionsElems = seletedFilterptions && seletedFilterptions.length > 0 
                                    ? seletedFilterptions.map(option => {
        return (
            <div className="selected-filter x-axis-flex" key={option.id}>
                <div className="filter-name x-axis-flex hide-scrollbar">
                    <p>{ option.name }</p>
                </div>
                <i className="bi bi-x"></i>
            </div>
        );
    }) : null;

    return (
        <motion.div 
            initial={Common.mainElementsFramerVariants.slideFromRight}
            animate={Common.mainElementsFramerVariants.stay}
            exit={Common.mainElementsFramerVariants.exit}
            className="app-body-middle today-comp x-axis-flex"
        >
            <div className="task-comp-and-filter-wrapper y-axis-flex">
                <div className="task-listing-filters x-axis-flex">
                    <div className="task-filter-options-container y-axis-flex" tabIndex={0}>
                        <i 
                            className="fa fa-solid fa-filter"></i>
                        <Dropdown items={filterMenus} onListClick={handleFilterDropDownOption} />
                    </div>
                    <div className="selected-filter-options hide-scrollbar x-axis-flex">
                        { seletedFilterptionsElems }
                    </div>
                </div>
                <TaskComp 
                    predicate={allTasksPredicate}
                    shouldAwait={true}
                    taskData={allTasksLoader.allTasks}
                    openEditor={openEditor}
                    notifyTaskChange={notifyTaskChange}
                    id="all-tasks-key"
                    removeTasksAddInput={true}
                />
            </div>
            <TaskEditor 
                closeEditorStatus={closeEditor} 
                taskId={editorState.taskId}
                isOpen={editorState.isOpen}
                task={editorState.taskDetails}
                updateTask={taskToUdpate =>  updateTask(taskToUdpate, notifyTaskChange)}
                deleteTask={taskId =>  deleteTask(taskId, notifyTaskChange)}
            />
        </motion.div>
    )
}

export default AllTasks;
