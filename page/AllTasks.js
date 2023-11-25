import React, { useContext, useEffect, useRef, useState } from 'react'
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
import { useSelector } from 'react-redux'

export const allTasksLoader = () => {
    return defer({allTasks: TaskAPI.getAllTasks()});
}

const COMPLETED = "Completed";
const YET2FINISH = "Yet2Finish";

const AllTasks = () => {

    const onloadRef = useRef({isLoadQueryParamCheckFinished: false});

    const allTasksLoader = useLoaderData();

    const { TaskChangeEvent, updateTask, deleteTask, getTask, 
            subscribeToTaskChange, unSubscribeToTaskChange } = useContext(AppContext);

    const [ editorState, setEditorState ] = useState({
        isOpen: false,
        taskId: -1,
        taskDetails: null
    });

    const [ filterMenus, setFilterMenus ] = useState(null);

    const [ seletedFilterptions, setSelectedFilterOptions ] = useState(null);

    const [ searchParams, setSearchParams ] = useSearchParams();

    const theme = useSelector(state => state.settings.find(section => section.name === Common.SettingsSectionName.THEME));

    useEffect(() => {
        handleSearchParams();
    }, [searchParams]);

    useEffect(() => {
        checkSeletedFilters();
    }, [filterMenus]);

    const handleSearchParams = async () => {

        const response = await ListAPI.getAllListsOfUser();
        if(response.status !== 200) {
            Common.showErrorPopup(response.error, 2);
            return;
        }
        const lists = response.lists;

        if(searchParams.size) {

            let searchedLists = [];
            
            if(searchParams.has("list")) {
                searchedLists = searchParams.get("list").split(",").map(listId => parseInt(listId));
            }
       
            let listSelectOptions = lists.map(list => {
                return {
                    id: list.listId,
                    name: list.listName,
                    checked: searchedLists.includes(list.listId)
                }
            });
          
            const isCompleted = searchParams.has(COMPLETED) ? searchParams.get(COMPLETED) === "true" : false;
            const isYetToFinish = searchParams.has(YET2FINISH) ? searchParams.get(YET2FINISH) === "true" : false;
            setFilterMenus(getFilterOptionsWithList(listSelectOptions, isCompleted, isYetToFinish));
        }
        else {
            const listSelectOptions = lists.map(list => {
                return {
                    id: list.listId,
                    name: list.listName,
                    checked: false
                }
            });
            setFilterMenus(getFilterOptionsWithList(listSelectOptions, false, false));
        }
        onloadRef.current.isLoadQueryParamCheckFinished = true;
    }

    const getFilterOptionsWithList = ( lists, isCompleted, isYetToFinish ) => {
        return [
            {
                id: 1,
                name: COMPLETED,
                checked: isCompleted
            },
            {
                id: 2,
                name: YET2FINISH,
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
        if(!onloadRef.current.isLoadQueryParamCheckFinished) {
            return;
        }
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
                        filtered.push({id: list.id, name: list.name, isList: true});
                    }
                })
            }
        });
           
        setSelectedFilterOptions(filtered);

        setSearchParams(prevSearchParams => {
            Array.from(prevSearchParams).forEach(([key, value]) => {
                if(!filtered.some(fil => fil.name === key)) {
                    prevSearchParams.delete(key);
                }
            });
            filtered && filtered.forEach(fil => {
                if(!prevSearchParams.has(fil.isList ? "list" : fil.name)) {
                    prevSearchParams.set(fil.isList ? "list" : fil.name, fil.isList ? fil.id : true);
                }
                else if (fil.isList && !prevSearchParams.get("list").includes(fil.id)) {
                    prevSearchParams.set("list", prevSearchParams.get("list") + "," + fil.id);
                }
            });
            return prevSearchParams;
        });
    }

    const handleFilterDropDownOption = option => {
        // TODO Need to makes these strings as constants
        if(option.name === YET2FINISH || option.name === COMPLETED) {
            setFilterMenus(prev => {
                prev.forEach(p => {
                    // This "|| p.checked" condition is for toggling between Yet2Finish and Completed
                    if(p.id === option.id || p.checked) {
                        p.checked = !p.checked;
                    }
                });
                return [...prev];
            });
        }   
        else {
            setFilterMenus(prev => {
                const lists = prev.find(fmenu => fmenu.name === "List");
                if(lists) {
                    lists.subItems = option;
                }
                return [...prev];
            });
        }
    }

    const handleRemoveFilter = filter => {
        if(filter.isList) {
            setFilterMenus(prev => {
                const lists = prev.find(fmenu => fmenu.name === "List").subItems;
                lists.forEach(list => list.id === filter.id ? list.checked = false : list.checked);
                return [...prev];
            });
        }
        else {
            filter.checked = false;
            handleFilterDropDownOption(filter);
        }
    }

    const seletedFilterptionsElems = seletedFilterptions && seletedFilterptions.length > 0 
                                    ? seletedFilterptions.map(option => {
        return (
            <div className="selected-filter x-axis-flex" key={option.id}>
                <div className="filter-name x-axis-flex hide-scrollbar">
                    <p>{ option.name }</p>
                </div>
                <i onClick={() => handleRemoveFilter({...option})} className="bi bi-x"></i>
            </div>
        );
    }) : null;

    // Filtering task with selected filters ...
    const tasksFilter = tasks => {

        let filtered = tasks;

        if(!seletedFilterptions) {
            return tasks;
        }

        // First filtering all tasks with "Completed" or "Yet2Finish"
        if(seletedFilterptions.some(filter => filter.name === COMPLETED)) {
            filtered = tasks.filter(task => task.isCompleted);
        }
        else if(seletedFilterptions.some(filter => filter.name === YET2FINISH)) {
            filtered = tasks.filter(task => !task.isCompleted);
        }

        if(seletedFilterptions.some(filter => filter.isList)) {
            const filterLists = seletedFilterptions.filter(filter => filter.isList);
            filtered = filtered.filter(task => {
                // If all filtered list id passes
                return filterLists.every(filterList => {
                    // If any list of the task matched the filter list's id
                    return task.lists ? task.lists.some(list => list.listId === filterList.id) : false;
                });
            });
        }
        return filtered;
    }


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
                        <Dropdown 
                            items={filterMenus} 
                            theme={theme.options[0].value} 
                            onListClick={handleFilterDropDownOption}
                        />
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
                    shouldFilterTasks={true}
                    tasksFilter={tasksFilter}
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
