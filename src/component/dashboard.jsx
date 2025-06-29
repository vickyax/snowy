"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic'; // For dynamic import of ApexCharts
import TechnicianSettings from "@/component/Settings";
// Dynamically import ApexCharts to ensure it's rendered on the client side
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// --- SVG Icons for UI Elements ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const WrenchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17a1 1 0 00-1.41 0L6.17 7.08a1 1 0 000 1.41l3.54 3.54a1 1 0 001.41 0l3.91-3.91a1 1 0 000-1.41L11.49 3.17zM6.88 8.49L9.7 5.66l2.83 2.83-2.82 2.83-2.83-2.83zM14.5 11.5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-8 4a1 1 0 011-1h1a1 1 0 110 2H7.5a1 1 0 01-1-1zM11 18.5a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" clipRule="evenodd" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;

// --- Mock Data for Technician Orders ---
const initialOrders = [
    { id: 1, customer: 'John Doe', address: '123 Maple St, Springfield', service: 'AC Repair', status: 'New', phone: '555-1234' },
    { id: 2, customer: 'Jane Smith', address: '456 Oak Ave, Shelbyville', service: 'Refrigerator', status: 'In Progress', phone: '555-5678' },
    { id: 3, customer: 'Bob Johnson', address: '789 Pine Ln, Capital City', service: 'Washing Machine', status: 'Completed', phone: '555-9012' },
    { id: 4, customer: 'Alice Williams', address: '321 Elm Rd, Ogdenville', service: 'Oven', status: 'New', phone: '555-3456' },
    { id: 5, customer: 'Charlie Brown', address: '654 Cedar Blvd, North Haverbrook', service: 'Computer', status: 'Completed', phone: '555-7890' },
    { id: 6, customer: 'Diana Prince', address: '987 Birch Ct, Metropolis', service: 'Mobile', status: 'In Progress', phone: '555-2345' },
    { id: 7, customer: 'Clark Kent', address: '101 Daily Planet, Metropolis', service: 'TV Repair', status: 'Completed', phone: '555-0011' },
    { id: 8, customer: 'Bruce Wayne', address: 'Gotham City Mansion', service: 'Security System', status: 'New', phone: '555-2233' },
];

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block";
    const statusClasses = {
        'New': 'bg-blue-100 text-blue-800',
        'In Progress': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


// --- Order Card Component ---
const OrderCard = ({ order, onStatusChange }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800">{order.customer}</h3>
                    <StatusBadge status={order.status} />
                </div>
                <div className="mt-3 space-y-3 text-sm text-gray-600">
                    <p className="flex items-center"><MapPinIcon /> {order.address}</p>
                    <p className="flex items-center"><WrenchIcon /> {order.service}</p>
                    <p className="flex items-center"><PhoneIcon /> {order.phone}</p>
                </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-3">
                {order.status === 'New' && (
                    <button onClick={() => onStatusChange(order.id, 'In Progress')} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition">Accept</button>
                )}
                {order.status === 'In Progress' && (
                    <button onClick={() => onStatusChange(order.id, 'Completed')} className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition">Complete Job</button>
                )}
                {order.status === 'Completed' && (
                     <p className="text-sm text-gray-500 font-medium">Finished</p>
                )}
            </div>
        </motion.div>
    );
};


// --- Main Dashboard Page Component ---
const TechnicianDashboard = () => {
    const [orders, setOrders] = useState(initialOrders);
    const [activeFilter, setActiveFilter] = useState('All');

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(currentOrders =>
            currentOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const filteredOrders = useMemo(() => {
        if (activeFilter === 'All') return orders;
        return orders.filter(order => order.status === activeFilter);
    }, [orders, activeFilter]);

    const stats = useMemo(() => {
        const total = orders.length;
        const completed = orders.filter(o => o.status === 'Completed').length;
        const pending = total - completed;
        // Placeholder for satisfaction rate - ideally, this comes from actual feedback
        const satisfactionRate = 90; // Example: 90% customer satisfaction

        return {
            total,
            pending,
            completed,
            satisfactionRate,
            completedPercentage: total > 0 ? (completed / total) * 100 : 0,
            pendingPercentage: total > 0 ? (pending / total) * 100 : 0,
            // For the donut chart, we'll represent Completed vs. Pending directly.
            // Satisfaction can be a separate visual or text.
        };
    }, [orders]);

    const filterTabs = ['All', 'New', 'In Progress', 'Completed'];

    // ApexCharts options and series for the performance donut chart
    const donutChartOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Inter, sans-serif',
        },
        labels: ['Completed Orders', 'Pending Orders'],
        colors: ['#10B981', '#F59E0B'], // Green for completed, Yellow for pending
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toFixed(1) + '%';
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total Orders',
                            formatter: function (w) {
                                return stats.total; // Display total orders in the center
                            }
                        }
                    }
                }
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '14px',
            markers: {
                radius: 12,
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const donutChartSeries = [stats.completed, stats.pending];

    return (
        <div className="min-h-screen mt-20 bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Technician Dashboard</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Performance Summary with ApexCharts */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="flex justify-center items-center h-64 md:h-80 w-full">
                            {/* ApexCharts Donut Chart */}
                            <Chart
                                options={donutChartOptions}
                                series={donutChartSeries}
                                type="donut"
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center text-lg">
                                <span className="block w-4 h-4 rounded-full bg-green-500 mr-3"></span>
                                <p className="text-gray-700">Completed Orders: <span className="font-bold text-green-600">{stats.completed}</span></p>
                            </div>
                            <div className="flex items-center text-lg">
                                <span className="block w-4 h-4 rounded-full bg-yellow-500 mr-3"></span>
                                <p className="text-gray-700">Pending Orders: <span className="font-bold text-yellow-600">{stats.pending}</span></p>
                            </div>
                            <div className="flex items-center text-lg">
                                <span className="block w-4 h-4 rounded-full bg-blue-500 mr-3"></span>
                                <p className="text-gray-700">Total Orders Taken: <span className="font-bold text-blue-600">{stats.total}</span></p>
                            </div>
                            <div className="flex items-center text-lg">
                                <span className="block w-4 h-4 rounded-full bg-purple-500 mr-3"></span>
                                <p className="text-gray-700">Customer Satisfaction: <span className="font-bold text-purple-600">{stats.satisfactionRate}%</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Pending Jobs</h3>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Completed This Month</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                </div>

                {/* Orders Section */}
                <div>
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {filterTabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`${
                                        activeFilter === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm"
                                >
                                    <p className="text-gray-500">No orders found for this category.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TechnicianDashboard;