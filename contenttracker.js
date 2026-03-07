@WebServlet("/trackClick")
public class ClickTrackerServlet extends HttpServlet {
    private int clickCount = 0;

    @Override
    protected synchronized void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        clickCount++;
        System.out.println("Link clicked " + clickCount + " times.");
        resp.sendRedirect("https://example.com"); // Redirect to actual link
    }
}


