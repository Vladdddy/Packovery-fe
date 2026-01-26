import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orders.css";
import InfoIcon from "../assets/icons/info.tsx";
import { ordersService } from "../services/ordersService.ts";
import type { Order } from "../services/ordersService.ts";

interface OrdersTableProps {
  searchedOrders?: Order[];
}

function OrdersTable({ searchedOrders }: OrdersTableProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  // Calculate total pages based on actual number of orders
  const totalPages = Math.ceil(
    (Array.isArray(orders) ? orders.length : 0) / ITEMS_PER_PAGE,
  );

  // Get orders for current page
  const getCurrentPageOrders = () => {
    if (!Array.isArray(orders)) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return orders.slice(startIndex, endIndex);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersService.fetchOrders();
      if (data) {
        console.log("Orders received in OrdersTable:", data);
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasAnimated(true);
    if (searchedOrders && Array.isArray(searchedOrders)) {
      // Display the searched orders
      setOrders(searchedOrders);
      setLoading(false);
      setCurrentPage(1); // Reset to first page when searching
    } else {
      // Fetch all orders
      getOrders();
    }
  }, [searchedOrders]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate dynamic page numbers based on current page
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (currentPage <= 3) {
      // Show first 3 pages
      for (let i = 1; i <= Math.min(3, totalPages); i++) {
        pages.push(i);
      }
      if (totalPages > 4) {
        pages.push("...");
      }
      if (totalPages > 3) {
        pages.push(totalPages);
      }
    } else if (currentPage >= totalPages - 2) {
      // Show last 3 pages
      for (let i = Math.max(totalPages - 2, 1); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and neighbors (sliding window)
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const setStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "In attesa";
      case "ASSIGNED":
        return "Assegnato";
      case "CANCELLED":
        return "Annullato";
      case "FAILED":
        return "Fallito";
      case "IN_TRANSIT":
        return "In transito";
      case "DELIVERED":
        return "Consegnato";
      case "RETURNED":
        return "Restituito";
      default:
        return status;
    }
  };

  return (
    <div
      className={`orders-table-container ${hasAnimated ? "animate-in" : ""}`}
    >
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Tracking Code</th>
              <th>Stato</th>
              <th>Partenza</th>
              <th>Destinazione</th>
              <th>Data</th>
              <th>Peso</th>
              <th>Dimensione</th>
              <th>Dettagli</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                  }}
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                  }}
                >
                  No orders found
                </td>
              </tr>
            ) : (
              getCurrentPageOrders().map((order, index) => (
                <tr
                  key={`${order.trackingCode}-${index}`}
                  className={hasAnimated ? "animate-row" : ""}
                  style={
                    hasAnimated
                      ? {
                          animationDelay: `${index * 0.1}s`,
                        }
                      : {}
                  }
                >
                  <td>{order.trackingCode}</td>
                  <td>
                    <span
                      className={`status ${order.status?.toLowerCase().replace("_", "-") || ""}`}
                    >
                      {setStatusText(order.status)}
                    </span>
                  </td>
                  <td>
                    {order.pickUpCity && order.pickUpProvince
                      ? `${order.pickUpCity} ${order.pickUpProvince}`
                      : "N/A"}
                  </td>
                  <td>
                    {order.deliveryCity && order.deliveryProvince
                      ? `${order.deliveryCity} ${order.deliveryProvince}`
                      : "N/A"}
                  </td>
                  <td>{formatDate(order.creationDate)}</td>
                  <td>{order.weight || "N/A"}</td>
                  <td>{order.size || "N/A"}</td>
                  <td>
                    <button
                      className="detail-button"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <InfoIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={page}
                className={`pagination-button ${currentPage === page ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span key={`dots-${index}`} className="pagination-dots">
                {page}
              </span>
            ),
          )}
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default OrdersTable;
