---
title: Python计算几何模板
date: 2025-05-28 20:17:00
katex: true
tags:
  - 算法
  - python
  - 模板
  - 计算几何
reprintPolicy: cc_by_nc_nd
---
# 代码
``` python
from dataclasses import dataclass
from decimal import Decimal, getcontext
from enum import Enum, auto
import math
from typing import Self

getcontext().prec = 100
PI = Decimal(314159265_358979323846264_338327950288_419716939937510) / Decimal(10**50)


_epsilon_exponent = max(1, getcontext().prec - 20)
EPSILON = Decimal("1e-" + str(_epsilon_exponent))


@dataclass
class Vector:
    x: Decimal
    y: Decimal

    def __add__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, other):
        if isinstance(other, (int, float, Decimal)):
            return Vector(self.x * other, self.y * other)
        raise TypeError("Multiplication is only supported with a scalar.")

    def __truediv__(self, other):
        if isinstance(other, (int, float, Decimal)):
            if other == 0:
                raise ZeroDivisionError("Cannot divide vector by zero.")
            return Vector(self.x / other, self.y / other)
        raise TypeError("Division is only supported by a scalar.")

    def __neg__(self):
        return Vector(-self.x, -self.y)

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __eq__(self, other: Self):
        if not isinstance(other, Vector):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def cross_product(self, other: Self) -> Decimal:
        """计算二维叉积 (self x other)"""
        if not isinstance(other, Vector):
            raise TypeError("Cross product is only supported between two Vectors.")
        return self.x * other.y - self.y * other.x

    def dot_product(self, other: Self) -> Decimal:
        """计算二维点积 (self . other)"""
        if not isinstance(other, Vector):
            raise TypeError("Dot product is only supported between two Vectors.")
        return self.x * other.x + self.y * other.y

    def magnitude(self) -> Decimal:
        """计算向量的模长"""
        return (self.x**2 + self.y**2).sqrt()

    def normalized(self) -> Self:
        """返回单位向量"""
        magnitude = self.magnitude()
        if magnitude == 0:
            raise ZeroDivisionError("Cannot normalize a zero vector.")
        return Vector(self.x / magnitude, self.y / magnitude)

    def angle(self, other: Self) -> Decimal:
        """计算两个向量之间的夹角 (弧度)"""
        if not isinstance(other, Vector):
            raise TypeError("Angle calculation is only supported between two Vectors.")

        mag_self = self.magnitude()
        mag_other = other.magnitude()

        if mag_self == 0 or mag_other == 0:
            raise ValueError("Cannot calculate angle with a zero vector.")

        dot_prod = self.dot_product(other)
        cos_theta = dot_prod / (mag_self * mag_other)

        cos_theta = max(Decimal("-1"), min(Decimal("1"), cos_theta))

        return Decimal(math.acos(cos_theta))

    def angle_signed(self, other: Self) -> Decimal:
        """
        计算从 self 到 other 的有向夹角 (弧度)
        """
        if not isinstance(other, Vector):
            raise TypeError(
                "Signed angle calculation is only supported between two Vectors."
            )

        mag_self = self.magnitude()
        mag_other = other.magnitude()

        if mag_self == 0 or mag_other == 0:
            raise ValueError("Cannot calculate signed angle with a zero vector.")

        cross_prod = self.cross_product(other)
        dot_prod = self.dot_product(other)

        if abs(dot_prod) < EPSILON and abs(cross_prod) < EPSILON:
            raise ValueError("Cannot calculate angle with a zero vector.")

        if abs(dot_prod) < EPSILON:
            if cross_prod > 0:
                return PI / 2
            elif cross_prod < 0:
                return -PI / 2
            else:
                return Decimal(0)
        else:
            angle_val = Decimal(math.atan(cross_prod / dot_prod))
            if dot_prod < 0:
                if cross_prod >= 0:
                    angle_val += PI
                else:
                    angle_val -= PI
            return angle_val

    def __abs__(self) -> Decimal:
        return self.Magnitude()

    def rotate(self, angle: Decimal) -> Self:
        """
        将向量绕原点旋转指定角度 (弧度)
        """
        cos_a = Decimal(math.cos(angle))
        sin_a = Decimal(math.sin(angle))
        new_x = self.x * cos_a - self.y * sin_a
        new_y = self.x * sin_a + self.y * cos_a
        return Vector(new_x, new_y)


@dataclass
class Point:
    x: Decimal
    y: Decimal

    def __sub__(self, other: "Point") -> Vector:
        """两点相减得到一个向量。"""
        if not isinstance(other, Point):
            return NotImplemented
        return Vector(self.x - other.x, self.y - other.y)

    def __add__(self, other: Vector) -> "Point":
        """点与向量相加得到一个新点。"""
        if not isinstance(other, Vector):
            return NotImplemented
        return Point(self.x + other.x, self.y + other.y)

    def __eq__(self, other: Self) -> bool:
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __str__(self) -> str:
        return f"({self.x}, {self.y})"

    def __repr__(self) -> str:
        return f"Point({self.x}, {self.y})"


@dataclass
class Line:
    p: Point
    v: Vector

    def is_point_on_line(self, q: Point) -> bool:
        """
        检查点 Q 是否在直线上
        """
        if not isinstance(q, Point):
            raise TypeError("Input q must be a Point.")

        pq_vector = q - self.p

        cross_prod_val = pq_vector.cross_product(self.v)

        return abs(cross_prod_val) < EPSILON

    def distance_to_point(self, q: Point) -> Decimal:
        """
        计算点 Q 到直线的距离
        """
        if not isinstance(q, Point):
            raise TypeError("Input q must be a Point.")

        pq_vector = q - self.p
        v_magnitude_squared = self.v.x**2 + self.v.y**2

        if v_magnitude_squared == 0:
            return ((q.x - self.p.x) ** 2 + (q.y - self.p.y) ** 2).sqrt()

        distance = abs(pq_vector.cross_product(self.v)) / v_magnitude_squared.sqrt()
        return distance

    def intersection(self, other: Self) -> Point | None:
        """
        计算两条直线的交点
        """
        if not isinstance(other, Line):
            raise TypeError("Input other must be a Line.")

        cross_prod_v = self.v.cross_product(other.v)

        if abs(cross_prod_v) < EPSILON:
            if abs((other.p - self.p).cross_product(self.v)) < EPSILON:
                return None
            else:
                return None

        t_numerator = (other.p - self.p).cross_product(other.v)
        t = t_numerator / cross_prod_v

        intersection_point = self.p + self.v * t

        return intersection_point

    def is_parallel_to(self, other: Self) -> bool:
        """
        检查两条直线是否平行
        """
        if not isinstance(other, Line):
            raise TypeError("Input other must be a Line.")

        cross_prod_v = self.v.cross_product(other.v)

        return abs(cross_prod_v) < EPSILON

    def get_perpendicular_line_through_point(self, q: Point) -> Self:
        """
        获取通过点 Q 且垂直于当前直线的直线
        """
        if not isinstance(q, Point):
            raise TypeError("Input q must be a Point.")

        v_perp = Vector(-self.v.y, self.v.x)

        if self.v.x == 0 and self.v.y == 0:
            raise ValueError("Cannot get perpendicular line from a zero vector line.")

        return Line(q, v_perp)

    def is_coincident_with(self, other: Self) -> bool:
        """
        检查两条直线是否重合
        """
        if not isinstance(other, Line):
            raise TypeError("Input other must be a Line.")

        if not self.is_parallel_to(other):
            return False

        return abs((other.p - self.p).cross_product(self.v)) < EPSILON

    def __contains__(self, point: Point) -> bool:
        return self.is_point_on_line(point)

    def __eq__(self, value: Self):
        if not isinstance(value, Line):
            return NotImplemented
        return self.p == value.p and self.v == value.v


@dataclass
class Polygon:
    points: list[Point]

    def area(self) -> Decimal:
        """计算多边形的面积"""
        n = len(self.points)
        if n < 3:
            return Decimal(0)

        area = Decimal(0)

        for i in range(n):
            p1 = self.points[i]
            p2 = self.points[(i + 1) % n]

            area += p1.x * p2.y
            area -= p1.y * p2.x

        return abs(area) / Decimal(2)

    def is_convex(self) -> bool:
        """
        检查多边形是否为凸多边形
        """
        n = len(self.points)
        if n < 3:
            return True

        v1 = self.points[1] - self.points[0]
        v2 = self.points[2] - self.points[1]
        first_cross_product = v1.cross_product(v2)

        for i in range(n):
            p1 = self.points[i]
            p2 = self.points[(i + 1) % n]
            p3 = self.points[(i + 2) % n]

            vec1 = p2 - p1
            vec2 = p3 - p2

            current_cross_product = vec1.cross_product(vec2)

            if first_cross_product > 0 and current_cross_product < 0:
                return False
            if first_cross_product < 0 and current_cross_product > 0:
                return False

            if first_cross_product == 0 and current_cross_product != 0:
                first_cross_product = current_cross_product
        return True

    def __contains__(self, point: Point) -> bool:
        """
        检查点是否在多边形内，包括边界和顶点
        """
        if not isinstance(point, Point):
            raise TypeError("Input point must be a Point.")

        n = len(self.points)
        if n < 3:
            return False

        crossings = 0
        for i in range(n):
            p1 = self.points[i]
            p2 = self.points[(i + 1) % n]

            if (p1.y <= point.y < p2.y) or (p2.y <= point.y < p1.y):
                x_at_y = p1.x + (point.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y)
                if point.x < x_at_y:
                    crossings += 1

        return crossings % 2 == 1


class CirclePos(Enum):
    INTERSECT = auto()
    TANGENT = auto()
    DISJOINT = auto()
    CONTAINS = auto()
    CONTAINED_BY = auto()
    EQUAL = auto()


@dataclass
class Circle:
    center: Point
    radius: Decimal

    def area(self) -> Decimal:
        return PI * self.radius**2

    def circumference(self) -> Decimal:
        return 2 * PI * self.radius

    def intersection_with_line(self, line: Line) -> list[Point]:
        """
        计算圆和直线的交点
        """
        if not isinstance(line, Line):
            raise TypeError("Input line must be a Line.")

        pc_vector = self.center - line.p

        v_magnitude_squared = line.v.x**2 + line.v.y**2

        if v_magnitude_squared == 0:
            raise ValueError("Line direction vector cannot be zero.")

        distance_to_line = (
            abs(pc_vector.cross_product(line.v)) / v_magnitude_squared.sqrt()
        )

        if distance_to_line > self.radius + EPSILON:
            return []
        elif abs(distance_to_line - self.radius) <= EPSILON:
            dot_product_pc_v = pc_vector.x * line.v.x + pc_vector.y * line.v.y
            t = dot_product_pc_v / v_magnitude_squared
            tangent_point = line.p + line.v * t
            return [tangent_point]
        else:
            dot_product_pc_v = pc_vector.x * line.v.x + pc_vector.y * line.v.y
            t_closest = dot_product_pc_v / v_magnitude_squared
            closest_point_on_line = line.p + line.v * t_closest

            distance_from_closest_to_intersection_squared = (
                self.radius**2 - distance_to_line**2
            )

            if distance_from_closest_to_intersection_squared < 0:
                distance_from_closest_to_intersection = Decimal(0)
            else:
                distance_from_closest_to_intersection = (
                    distance_from_closest_to_intersection_squared.sqrt()
                )

            v_magnitude = v_magnitude_squared.sqrt()
            if v_magnitude == 0:
                raise ValueError("Line direction vector cannot be zero.")

            unit_v = line.v / v_magnitude

            intersection1 = (
                closest_point_on_line + unit_v * distance_from_closest_to_intersection
            )
            intersection2 = (
                closest_point_on_line - unit_v * distance_from_closest_to_intersection
            )

            return [intersection1, intersection2]

    def intersection_with_circle(self, other: Self) -> list[Point]:
        """
        计算两个圆的交点
        """
        if not isinstance(other, Circle):
            raise TypeError("Input other must be a Circle.")

        if self.center == other.center:
            if self.radius == other.radius:
                return []
            else:
                return []

        distance_between_centers = (self.center - other.center).magnitude()

        sum_of_radii = self.radius + other.radius
        diff_of_radii = abs(self.radius - other.radius)

        if distance_between_centers > sum_of_radii + EPSILON:
            return []
        elif abs(distance_between_centers - sum_of_radii) <= EPSILON:
            direction_vector = (other.center - self.center).normalized()
            intersection_point = self.center + direction_vector * self.radius
            return [intersection_point]
        elif distance_between_centers < diff_of_radii - EPSILON:
            return []
        elif abs(distance_between_centers - diff_of_radii) <= EPSILON:
            direction_vector = (other.center - self.center).normalized()
            intersection_point = self.center + direction_vector * self.radius
            return [intersection_point]
        else:
            cx1, cy1 = self.center.x, self.center.y
            cx2, cy2 = other.center.x, other.center.y
            r1, r2 = self.radius, other.radius

            A = 2 * (cx2 - cx1)
            B = 2 * (cy2 - cy1)
            C = (r1**2 - r2**2) - (cx1**2 - cx2**2) - (cy1**2 - cy2**2)

            if abs(B) < EPSILON:
                if abs(A) < EPSILON:
                    return []

                x_val = C / A
                discriminant = r1**2 - (x_val - cx1) ** 2

                if discriminant < -EPSILON:
                    return []
                elif abs(discriminant) <= EPSILON:
                    y_val = cy1
                    return [Point(x_val, y_val)]
                else:
                    y1 = cy1 + discriminant.sqrt()
                    y2 = cy1 - discriminant.sqrt()
                    return [Point(x_val, y1), Point(x_val, y2)]
            else:
                a = 1 + (A / B) ** 2
                k = C / B - cy1
                b = -2 * (cx1 + k * (A / B))
                c = cx1**2 + k**2 - r1**2

                discriminant = b**2 - 4 * a * c

                if discriminant < -EPSILON:
                    return []
                elif abs(discriminant) <= EPSILON:
                    x_val = -b / (2 * a)
                    y_val = (C - A * x_val) / B
                    return [Point(x_val, y_val)]
                else:
                    x1 = (-b + discriminant.sqrt()) / (2 * a)
                    x2 = (-b - discriminant.sqrt()) / (2 * a)
                    y1 = (C - A * x1) / B
                    y2 = (C - A * x2) / B
                    return [Point(x1, y1), Point(x2, y2)]

    def relationship_with_point(self, point: Point) -> CirclePos:
        """确定圆和点的关系"""
        if not isinstance(point, Point):
            raise TypeError("Input point must be a Point.")

        distance_squared = (point.x - self.center.x) ** 2 + (
            point.y - self.center.y
        ) ** 2
        radius_squared = self.radius**2

        if distance_squared > radius_squared + EPSILON:
            return CirclePos.DISJOINT
        elif abs(distance_squared - radius_squared) <= EPSILON:
            return CirclePos.TANGENT
        else:
            return CirclePos.INTERSECT

    def relationship_with_line(self, line: Line) -> CirclePos:
        """确定圆和直线的关系"""
        if not isinstance(line, Line):
            raise TypeError("Input line must be a Line.")

        distance_to_line = self.distance_to_point(line)

        if distance_to_line > self.radius + EPSILON:
            return CirclePos.DISJOINT
        elif abs(distance_to_line - self.radius) <= EPSILON:
            return CirclePos.TANGENT
        else:
            return CirclePos.INTERSECT

    def relationship_with_circle(self, other: Self) -> list[CirclePos]:
        """确定两个圆的关系"""
        if not isinstance(other, Circle):
            raise TypeError("Input other must be a Circle.")

        distance_between_centers = (self.center - other.center).magnitude()

        sum_of_radii = self.radius + other.radius
        diff_of_radii = abs(self.radius - other.radius)

        if distance_between_centers > sum_of_radii + EPSILON:
            return [CirclePos.DISJOINT]
        elif abs(distance_between_centers - sum_of_radii) <= EPSILON:
            return [CirclePos.TANGENT]
        elif distance_between_centers < diff_of_radii - EPSILON:
            if self.radius > other.radius:
                return [CirclePos.CONTAINS]
            elif other.radius > self.radius:
                return [CirclePos.CONTAINED_BY]
            else:
                return [CirclePos.EQUAL]
        elif abs(distance_between_centers - diff_of_radii) <= EPSILON:
            return [CirclePos.TANGENT, CirclePos.CONTAINS]
        else:
            return [CirclePos.INTERSECT]

    def intersection_area_with_circle(self, other: Self) -> Decimal:
        """
        计算两个圆的相交面积

        """
        if not isinstance(other, Circle):
            raise TypeError("Input other must be a Circle.")

        if self.center == other.center:
            if self.radius == other.radius:
                return self.area()
            else:
                return min(self.area(), other.area())

        distance_between_centers = (self.center - other.center).magnitude()

        sum_of_radii = self.radius + other.radius
        diff_of_radii = abs(self.radius - other.radius)

        if distance_between_centers > sum_of_radii + EPSILON:
            return Decimal(0)
        elif abs(distance_between_centers - sum_of_radii) <= EPSILON:
            return Decimal(0)
        elif distance_between_centers < diff_of_radii - EPSILON:
            return min(self.area(), other.area())
        elif abs(distance_between_centers - diff_of_radii) <= EPSILON:
            return min(self.area(), other.area())
        else:
            r1, r2 = self.radius, other.radius
            d = distance_between_centers

            if d == 0:
                if r1 == r2:
                    return self.area()
                else:
                    return min(self.area(), other.area())

            arg1 = (r1**2 + d**2 - r2**2) / (2 * r1 * d)
            arg2 = (r2**2 + d**2 - r1**2) / (2 * r2 * d)

            if abs(arg1) > 1:
                arg1 = Decimal(1) if arg1 > 1 else Decimal(-1)
            if abs(arg2) > 1:
                arg2 = Decimal(1) if arg2 > 1 else Decimal(-1)

            theta1 = Decimal(math.acos(arg1))
            theta2 = Decimal(math.acos(arg2))

            return r1**2 * theta1 + r2**2 * theta2 - d * r1 * Decimal(math.sin(theta1))

    def __contains__(self, point: Point) -> bool:
        """检查点是否在圆内"""
        if not isinstance(point, Point):
            raise TypeError("Input point must be a Point.")
        distance_squared = (point.x - self.center.x) ** 2 + (
            point.y - self.center.y
        ) ** 2
        return distance_squared <= self.radius**2

```
# 一些例题
https://www.luogu.com.cn/record/218577892
[P1183 多边形的面积](https://www.luogu.com.cn/problem/P1183)

https://www.luogu.com.cn/record/218580033
[P1652 圆](https://www.luogu.com.cn/problem/P1652)